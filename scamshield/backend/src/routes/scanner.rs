use axum::{
    middleware,
    routing::post,
    Router,
};

use crate::{
    handlers::scanner_handler,
    middleware::auth_required,
    state::AppState,
};

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/analyze", post(scanner_handler::analyze))
        .route("/message", post(scanner_handler::scan_message))
        .route("/url", post(scanner_handler::scan_url))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_required,
        ))
        .with_state(state)
}

