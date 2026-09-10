mod config;
mod db;
mod models;
mod routes;
mod stripe;

use axum::{routing::{get, post}, Router};
use sqlx::SqlitePool;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::{ServeDir, ServeFile};

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
    pub config: config::Config,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cfg = config::Config::from_env();
    let pool = db::create_pool(&cfg.database_url).await;
    db::run_migrations(&pool).await;

    let state = AppState {
        pool,
        config: cfg.clone(),
    };

    let api = Router::new()
        .route("/api/products", get(routes::products::list_products))
        .route("/api/products/:slug", get(routes::products::get_product))
        .route("/api/orders", post(routes::orders::create_order))
        .route("/api/webhook/stripe", post(routes::stripe_webhook::stripe_webhook))
        .with_state(state);

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = api
        .layer(cors)
        .fallback_service(
            ServeDir::new("../frontend")
                .not_found_service(ServeFile::new("../frontend/404.html")),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Failed to bind to port 3000");

    tracing::info!("SEASO server running on http://localhost:3000");
    axum::serve(listener, app).await.expect("Server error");
}
