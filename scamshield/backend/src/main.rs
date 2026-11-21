use std::sync::Arc;

use axum::{http::Method, Router};
use sqlx::postgres::PgPoolOptions;
use tower_http::{
    cors::{Any, CorsLayer},
    limit::RequestBodyLimitLayer,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use scamshield_backend::{
    config::Config,
    routes::api_router,
    state::AppState,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables from .env if present
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "scamshield_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = Config::from_env()?;
    tracing::info!("Configuration loaded. Starting on {}:{}", config.host, config.port);

    // Create database connection pool
    let db_pool = PgPoolOptions::new()
        .max_connections(20)
        .connect(&config.database_url)
        .await?;

    tracing::info!("Database connection established");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&db_pool)
        .await?;

    tracing::info!("Migrations applied successfully");

    // Build application state
    let state = AppState {
        db: db_pool,
        config: Arc::new(config.clone()),
    };

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::PATCH, Method::DELETE, Method::OPTIONS])
        .allow_origin(config.frontend_origin.parse::<axum::http::HeaderValue>()?)
        .allow_headers(Any)
        .allow_credentials(false);

    // Build the router
    let app = Router::new()
        .route("/health", axum::routing::get(|| async { axum::Json(serde_json::json!({"status": "healthy"})) }))
        .nest("/api/v1", api_router(state))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .layer(RequestBodyLimitLayer::new(1024 * 1024)); // 1 MB limit

    // Start server
    let addr = format!("{}:{}", config.host, config.port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Server listening on {}", addr);

    axum::serve(listener, app).await?;

    Ok(())
}

