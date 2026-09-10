use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::body::Bytes;

use crate::models::order;
use crate::AppState;

pub async fn stripe_webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: Bytes,
) -> StatusCode {
    let signature = match headers.get("stripe-signature") {
        Some(sig) => match sig.to_str() {
            Ok(s) => s.to_string(),
            Err(_) => return StatusCode::BAD_REQUEST,
        },
        None => return StatusCode::BAD_REQUEST,
    };

    let payload = match std::str::from_utf8(&body) {
        Ok(s) => s,
        Err(_) => return StatusCode::BAD_REQUEST,
    };

    let event = match stripe::Webhook::construct_event(
        payload,
        &signature,
        &state.config.stripe_webhook_secret,
    ) {
        Ok(event) => event,
        Err(_) => return StatusCode::BAD_REQUEST,
    };

    if event.type_ == stripe::EventType::CheckoutSessionCompleted {
        if let stripe::EventObject::CheckoutSession(session) = event.data.object {
            if let Some(session_id) = session.id.as_str().into() {
                let _ = order::mark_paid(&state.pool, session_id).await;
            }
        }
    }

    StatusCode::OK
}
