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

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use axum::{
        body::Body,
        http::{header::AUTHORIZATION, Request, StatusCode},
    };
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;
    use uuid::Uuid;
    use crate::{config::Config, utils::generate_access_token};

    fn create_test_state() -> AppState {
        let config = Config {
            database_url: "postgres://localhost/dummy".to_string(),
            jwt_secret: "test_secret_key_for_admin_routes_1234567890".to_string(),
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
    async fn test_admin_routes_unauthorized_without_token() {
        let state = create_test_state();
        let app = router(state);

        let req = Request::builder()
            .uri("/rules")
            .method("GET")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_admin_routes_forbidden_for_standard_user() {
        let state = create_test_state();
        let app = router(state.clone());

        let user_id = Uuid::new_v4();
        let user_token = generate_access_token(
            user_id,
            "regular_user@scamshield.local",
            "user",
            &state.config.jwt_secret,
            900,
        )
        .unwrap();

        let req = Request::builder()
            .uri("/rules")
            .method("GET")
            .header(AUTHORIZATION, format!("Bearer {}", user_token))
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::FORBIDDEN);
    }
}

