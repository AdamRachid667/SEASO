use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Order {
    pub id: i64,
    pub email: String,
    pub stripe_session_id: Option<String>,
    pub status: String,
    pub total_cents: i64,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct OrderItemRequest {
    pub product_id: i64,
    pub size: String,
    pub quantity: i64,
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub email: String,
    pub items: Vec<OrderItemRequest>,
}

pub async fn create_order(pool: &SqlitePool, req: &CreateOrderRequest) -> Result<Order, sqlx::Error> {
    let mut total_cents: i64 = 0;

    for item in &req.items {
        let price: (i64,) = sqlx::query_as("SELECT price_cents FROM products WHERE id = ?")
            .bind(item.product_id)
            .fetch_one(pool)
            .await?;
        total_cents += price.0 * item.quantity;
    }

    let order: Order = sqlx::query_as(
        "INSERT INTO orders (email, total_cents) VALUES (?, ?) RETURNING id, email, stripe_session_id, status, total_cents, created_at"
    )
    .bind(&req.email)
    .bind(total_cents)
    .fetch_one(pool)
    .await?;

    for item in &req.items {
        let price: (i64,) = sqlx::query_as("SELECT price_cents FROM products WHERE id = ?")
            .bind(item.product_id)
            .fetch_one(pool)
            .await?;

        sqlx::query(
            "INSERT INTO order_items (order_id, product_id, size, quantity, unit_price_cents) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(order.id)
        .bind(item.product_id)
        .bind(&item.size)
        .bind(item.quantity)
        .bind(price.0)
        .execute(pool)
        .await?;
    }

    Ok(order)
}

pub async fn set_stripe_session(pool: &SqlitePool, order_id: i64, session_id: &str) -> Result<(), sqlx::Error> {
    sqlx::query("UPDATE orders SET stripe_session_id = ? WHERE id = ?")
        .bind(session_id)
        .bind(order_id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn mark_paid(pool: &SqlitePool, stripe_session_id: &str) -> Result<(), sqlx::Error> {
    sqlx::query("UPDATE orders SET status = 'paid', paid_at = datetime('now') WHERE stripe_session_id = ?")
        .bind(stripe_session_id)
        .execute(pool)
        .await?;
    Ok(())
}
