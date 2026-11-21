pub mod auth;
pub mod scanner;
pub mod history;
pub mod dashboard;
pub mod admin;

use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use crate::state::AppState;

async fn health_check() -> Json<Value> {
    Json(json!({
        "status": "healthy",
        "service": "scamshield-backend",
        "version": "0.1.0"
    }))
}

pub fn api_router(state: AppState) -> Router {
    Router::new()
        .route("/health", get(health_check))
        .nest("/auth", auth::router(state.clone()))
        .nest("/scanner", scanner::router(state.clone()))
        .nest("/history", history::router(state.clone()))
        .nest("/dashboard", dashboard::router(state.clone()))
        .nest("/admin", admin::router(state))
}

