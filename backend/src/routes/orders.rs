use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;

use crate::models::order;
use crate::stripe::create_checkout_session;
use crate::AppState;

#[derive(Serialize)]
pub struct CheckoutResponse {
    pub checkout_url: String,
}

pub async fn create_order(
    State(state): State<AppState>,
    Json(req): Json<order::CreateOrderRequest>,
) -> Result<Json<CheckoutResponse>, StatusCode> {
    let db_order = order::create_order(&state.pool, &req)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let checkout_url = create_checkout_session(&state, &db_order, &req.items)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    order::set_stripe_session(&state.pool, db_order.id, &checkout_url.session_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(CheckoutResponse {
        checkout_url: checkout_url.url,
    }))
}
