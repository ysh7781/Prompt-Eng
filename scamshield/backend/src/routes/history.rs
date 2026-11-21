use axum::{
    middleware,
    routing::get,
    Router,
};

use crate::{
    handlers::history_handler,
    middleware::auth_required,
    state::AppState,
};

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/", get(history_handler::list_history))
        .route("/:id", get(history_handler::get_scan_detail).delete(history_handler::delete_scan))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_required,
        ))
        .with_state(state)
}

