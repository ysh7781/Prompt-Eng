use axum::{
    middleware,
    routing::{get, patch},
    Router,
};

use crate::{
    handlers::dashboard_handler,
    middleware::auth_middleware::admin_required,
    state::AppState,
};

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/dashboard", get(dashboard_handler::get_admin_dashboard))
        .route("/stats", get(dashboard_handler::get_admin_dashboard))
        .route("/rules", get(dashboard_handler::list_rules).post(dashboard_handler::create_rule))
        .route("/rules/:id", patch(dashboard_handler::update_rule).delete(dashboard_handler::delete_rule))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            admin_required,
        ))
        .with_state(state)
}

