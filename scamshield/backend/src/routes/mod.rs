pub mod auth;
pub mod scanner;
pub mod history;
pub mod dashboard;
pub mod admin;

use axum::Router;
use crate::state::AppState;

pub fn api_router(state: AppState) -> Router {
    Router::new()
        .nest("/auth", auth::router(state.clone()))
        .nest("/scanner", scanner::router(state.clone()))
        .nest("/history", history::router(state.clone()))
        .nest("/dashboard", dashboard::router(state.clone()))
        .nest("/admin", admin::router(state))
}

