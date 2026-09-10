use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;

use crate::models::product;
use crate::AppState;

pub async fn list_products(
    State(state): State<AppState>,
) -> Result<Json<Vec<product::ProductWithSizes>>, StatusCode> {
    product::list_all(&state.pool)
        .await
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn get_product(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<product::ProductWithSizes>, StatusCode> {
    match product::get_by_slug(&state.pool, &slug).await {
        Ok(Some(p)) => Ok(Json(p)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}
