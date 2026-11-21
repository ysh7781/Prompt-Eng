use axum::{
    middleware,
    routing::get,
    Router,
};

use crate::{
    handlers::dashboard_handler,
    middleware::auth_required,
    state::AppState,
};

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/", get(dashboard_handler::get_dashboard))
        .route("/stats", get(dashboard_handler::get_stats))
        .route("/recent-scans", get(dashboard_handler::get_recent_scans))
        .route("/risk-distribution", get(dashboard_handler::get_risk_distribution))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_required,
        ))
        .with_state(state)
}

