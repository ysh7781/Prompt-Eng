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

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;
    use uuid::Uuid;
    use crate::config::Config;

    fn create_test_state() -> AppState {
        let config = Config {
            database_url: "postgres://localhost/dummy".to_string(),
            jwt_secret: "test_secret_key_for_history_routes_1234567890".to_string(),
            jwt_access_expiry_seconds: 900,
            jwt_refresh_expiry_seconds: 604800,
            frontend_origin: "http://localhost:5173".to_string(),
            host: "0.0.0.0".to_string(),
            port: 8080,
        };

        let pool = PgPoolOptions::new()
            .connect_lazy("postgres://localhost/dummy")
            .expect("Lazy pool creation should succeed");

        AppState {
            db: pool,
            config: Arc::new(config),
        }
    }

    #[tokio::test]
    async fn test_history_list_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/")
            .method("GET")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_history_detail_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let scan_id = Uuid::new_v4();
        let req = Request::builder()
            .uri(format!("/{}", scan_id))
            .method("GET")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }
}

