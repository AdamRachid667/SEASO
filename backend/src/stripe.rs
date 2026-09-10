use stripe::{
    Client, CreateCheckoutSession, CreateCheckoutSessionLineItems,
    CreateCheckoutSessionLineItemsPriceData, CreateCheckoutSessionLineItemsPriceDataProductData,
    CheckoutSessionMode, Currency,
};

use crate::models::order::{Order, OrderItemRequest};
use crate::AppState;

pub struct CheckoutResult {
    pub session_id: String,
    pub url: String,
}

pub async fn create_checkout_session(
    state: &AppState,
    db_order: &Order,
    items: &[OrderItemRequest],
) -> Result<CheckoutResult, stripe::StripeError> {
    let client = Client::new(&state.config.stripe_secret_key);

    let line_items: Vec<CreateCheckoutSessionLineItems> = items
        .iter()
        .map(|item| CreateCheckoutSessionLineItems {
            price_data: Some(CreateCheckoutSessionLineItemsPriceData {
                currency: Currency::EUR,
                unit_amount: Some(3500),
                product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
                    name: format!("SEASO T-shirt (taille {})", item.size),
                    ..Default::default()
                }),
                ..Default::default()
            }),
            quantity: Some(item.quantity as u64),
            ..Default::default()
        })
        .collect();

    let success_url = format!("{}/cart.html?success=1", state.config.frontend_url);
    let cancel_url = format!("{}/cart.html?cancelled=1", state.config.frontend_url);

    let mut params = CreateCheckoutSession::new();
    params.line_items = Some(line_items);
    params.mode = Some(CheckoutSessionMode::Payment);
    params.success_url = Some(&success_url);
    params.cancel_url = Some(&cancel_url);
    params.customer_email = Some(&db_order.email);

    let session = stripe::CheckoutSession::create(&client, params).await?;

    Ok(CheckoutResult {
        session_id: session.id.to_string(),
        url: session.url.unwrap_or_default(),
    })
}
