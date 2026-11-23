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

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use axum::{
        body::Body,
        http::{header::CONTENT_TYPE, Request, StatusCode},
    };
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;
    use crate::config::Config;

    fn create_test_state() -> AppState {
        let config = Config {
            database_url: "postgres://localhost/dummy".to_string(),
            jwt_secret: "test_secret_key_for_auth_routes_1234567890".to_string(),
            jwt_access_expiry_seconds: 900,
            jwt_refresh_expiry_seconds: 604800,
            frontend_origin: "http://localhost:5173".to_string(),
            host: "0.0.0.0".to_string(),
            port: 8080,
            gemini_api_key: None,
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
    async fn test_protected_me_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/me")
            .method("GET")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_protected_logout_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/logout")
            .method("POST")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_refresh_token_missing_both_body_and_cookie() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/refresh")
            .method("POST")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_register_validation_failure() {
        let state = create_test_state();
        let app = router(state);

        let invalid_body = serde_json::json!({
            "name": "A",
            "email": "invalid-email",
            "password": "short"
        });

        let req = Request::builder()
            .uri("/register")
            .method("POST")
            .header(CONTENT_TYPE, "application/json")
            .body(Body::from(serde_json::to_vec(&invalid_body).unwrap()))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNPROCESSABLE_ENTITY);
    }

    #[tokio::test]
    async fn test_login_validation_failure() {
        let state = create_test_state();
        let app = router(state);

        let invalid_body = serde_json::json!({
            "email": "not-an-email",
            "password": "pwd"
        });

        let req = Request::builder()
            .uri("/login")
            .method("POST")
            .header(CONTENT_TYPE, "application/json")
            .body(Body::from(serde_json::to_vec(&invalid_body).unwrap()))
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNPROCESSABLE_ENTITY);
    }
}
