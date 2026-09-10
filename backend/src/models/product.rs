use serde::Serialize;
use sqlx::SqlitePool;

#[derive(Debug, sqlx::FromRow)]
pub struct Product {
    pub id: i64,
    pub slug: String,
    pub name: String,
    pub wonder: String,
    pub description: String,
    pub price_cents: i64,
    pub image_url: String,
    pub active: bool,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct ProductWithSizes {
    pub id: i64,
    pub slug: String,
    pub name: String,
    pub wonder: String,
    pub description: String,
    pub price_cents: i64,
    pub image_url: String,
    pub sizes: Vec<String>,
}

impl Product {
    fn with_sizes(self, sizes: Vec<String>) -> ProductWithSizes {
        ProductWithSizes {
            id: self.id,
            slug: self.slug,
            name: self.name,
            wonder: self.wonder,
            description: self.description,
            price_cents: self.price_cents,
            image_url: self.image_url,
            sizes,
        }
    }
}

pub async fn list_all(pool: &SqlitePool) -> Result<Vec<ProductWithSizes>, sqlx::Error> {
    let products: Vec<Product> = sqlx::query_as(
        "SELECT id, slug, name, wonder, description, price_cents, image_url, active, created_at FROM products WHERE active = 1"
    )
    .fetch_all(pool)
    .await?;

    let mut result = Vec::with_capacity(products.len());
    for product in products {
        let sizes: Vec<(String,)> = sqlx::query_as(
            "SELECT size FROM product_sizes WHERE product_id = ? AND in_stock = 1"
        )
        .bind(product.id)
        .fetch_all(pool)
        .await?;

        let sizes: Vec<String> = sizes.into_iter().map(|(s,)| s).collect();
        result.push(product.with_sizes(sizes));
    }

    Ok(result)
}

pub async fn get_by_slug(pool: &SqlitePool, slug: &str) -> Result<Option<ProductWithSizes>, sqlx::Error> {
    let product: Option<Product> = sqlx::query_as(
        "SELECT id, slug, name, wonder, description, price_cents, image_url, active, created_at FROM products WHERE slug = ? AND active = 1"
    )
    .bind(slug)
    .fetch_optional(pool)
    .await?;

    match product {
        Some(product) => {
            let sizes: Vec<(String,)> = sqlx::query_as(
                "SELECT size FROM product_sizes WHERE product_id = ? AND in_stock = 1"
            )
            .bind(product.id)
            .fetch_all(pool)
            .await?;

            let sizes: Vec<String> = sizes.into_iter().map(|(s,)| s).collect();
            Ok(Some(product.with_sizes(sizes)))
        }
        None => Ok(None),
    }
}
