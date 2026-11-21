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
    let protected = Router::new()
        .route("/analyze", post(scanner_handler::analyze))
        .route("/message", post(scanner_handler::scan_message))
        .route("/url", post(scanner_handler::scan_url))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_required,
        ));

    let public = Router::new()
        .route("/demo", post(scanner_handler::demo_scan));

    Router::new()
        .merge(public)
        .merge(protected)
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
    use crate::config::Config;

    fn create_test_state() -> AppState {
        let config = Config {
            database_url: "postgres://localhost/dummy".to_string(),
            jwt_secret: "test_secret_key_for_scanner_routes_1234567890".to_string(),
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
    async fn test_scanner_analyze_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/analyze")
            .method("POST")
            .header("Content-Type", "application/json")
            .body(Body::from(r#"{"input":"hello","input_type":"message"}"#))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_scanner_message_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/message")
            .method("POST")
            .header("Content-Type", "application/json")
            .body(Body::from(r#"{"content":"suspicious message"}"#))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_scanner_url_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/url")
            .method("POST")
            .header("Content-Type", "application/json")
            .body(Body::from(r#"{"url":"https://example.com"}"#))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_scanner_demo_success_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/demo")
            .method("POST")
            .header("Content-Type", "application/json")
            .body(Body::from(r#"{"input":"Dear Customer, urgent kyc update needed at http://192.168.1.1/kyc","input_type":"message"}"#))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
    }
}

