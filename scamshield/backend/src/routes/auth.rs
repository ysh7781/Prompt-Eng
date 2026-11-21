use axum::{
    middleware,
    routing::{get, post},
    Router,
};

use crate::{
    handlers::auth_handler,
    middleware::auth_required,
    state::AppState,
};

pub fn router(state: AppState) -> Router {
    let public_routes = Router::new()
        .route("/register", post(auth_handler::register))
        .route("/login", post(auth_handler::login))
        .route("/refresh", post(auth_handler::refresh_token));

    let protected_routes = Router::new()
        .route("/me", get(auth_handler::me))
        .route("/logout", post(auth_handler::logout))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_required,
        ));

    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .with_state(state)
}

