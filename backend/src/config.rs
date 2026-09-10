use std::env;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub stripe_secret_key: String,
    pub stripe_webhook_secret: String,
    pub frontend_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();
        Self {
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:seaso.db".into()),
            stripe_secret_key: env::var("STRIPE_SECRET_KEY").expect("STRIPE_SECRET_KEY must be set"),
            stripe_webhook_secret: env::var("STRIPE_WEBHOOK_SECRET").expect("STRIPE_WEBHOOK_SECRET must be set"),
            frontend_url: env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3000".into()),
        }
    }
}
