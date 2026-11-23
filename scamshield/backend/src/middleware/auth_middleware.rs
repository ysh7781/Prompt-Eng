use axum::{
    body::Body,
    extract::{Request, State},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};

use crate::{
    error::AppError,
    state::AppState,
    utils::verify_access_token,
};

/// Helper to extract and validate Bearer token from the Authorization header.
fn extract_bearer_token(req: &Request<Body>) -> Result<&str, AppError> {
    let auth_header = req
        .headers()
        .get(AUTHORIZATION)
        .and_then(|value| value.to_str().ok());

    match auth_header {
        Some(header) if header.len() > 7 && header[..7].eq_ignore_ascii_case("bearer ") => {
            let token = header[7..].trim();
            if token.is_empty() {
                Err(AppError::Unauthorized("Missing or invalid Authorization header".to_string()))
            } else {
                Ok(token)
            }
        }
        _ => Err(AppError::Unauthorized("Missing or invalid Authorization header".to_string())),
    }
}

pub async fn auth_required(
    State(state): State<AppState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    let token = extract_bearer_token(&req)?;
    let claims = verify_access_token(token, &state.config.jwt_secret)?;
    req.extensions_mut().insert(claims);

    Ok(next.run(req).await)
}

pub async fn admin_required(
    State(state): State<AppState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, AppError> {
    let token = extract_bearer_token(&req)?;
    let claims = verify_access_token(token, &state.config.jwt_secret)?;

    if claims.role != "admin" {
        return Err(AppError::Forbidden("Admin access required".to_string()));
    }

    req.extensions_mut().insert(claims);
    Ok(next.run(req).await)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use axum::{
        extract::Extension,
        http::{Request, StatusCode},
        middleware as axum_middleware,
        routing::get,
        Json, Router,
    };
    use serde_json::Value;
    use sqlx::postgres::PgPoolOptions;
    use tower::ServiceExt;
    use uuid::Uuid;
    use crate::{config::Config, utils::{generate_access_token, Claims}};

    fn create_test_state() -> AppState {
        let config = Config {
            database_url: "postgres://localhost/dummy".to_string(),
            jwt_secret: "test_middleware_jwt_secret_key_1234567890".to_string(),
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

    async fn echo_claims(Extension(claims): Extension<Claims>) -> Json<Value> {
        Json(serde_json::json!({
            "sub": claims.sub,
            "email": claims.email,
            "role": claims.role,
        }))
    }

    fn test_app(state: AppState) -> Router {
        let user_route = Router::new()
            .route("/api/user/me", get(echo_claims))
            .route_layer(axum_middleware::from_fn_with_state(state.clone(), auth_required));

        let admin_route = Router::new()
            .route("/api/admin/metrics", get(echo_claims))
            .route_layer(axum_middleware::from_fn_with_state(state.clone(), admin_required));

        Router::new()
            .merge(user_route)
            .merge(admin_route)
            .with_state(state)
    }

    #[tokio::test]
    async fn test_auth_required_missing_header() {
        let state = create_test_state();
        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/user/me")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_required_invalid_format() {
        let state = create_test_state();
        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/user/me")
            .header(AUTHORIZATION, "Basic username:password")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_required_empty_bearer_token() {
        let state = create_test_state();
        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/user/me")
            .header(AUTHORIZATION, "Bearer    ")
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_required_expired_token() {
        let state = create_test_state();
        let user_id = Uuid::new_v4();
        let expired_token = generate_access_token(
            user_id,
            "expired@scamshield.local",
            "user",
            &state.config.jwt_secret,
            -120, // Expired 120s ago
        ).unwrap();

        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/user/me")
            .header(AUTHORIZATION, format!("Bearer {}", expired_token))
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_required_valid_token() {
        let state = create_test_state();
        let user_id = Uuid::new_v4();
        let email = "valid@scamshield.local";
        let valid_token = generate_access_token(
            user_id,
            email,
            "user",
            &state.config.jwt_secret,
            900,
        ).unwrap();

        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/user/me")
            .header(AUTHORIZATION, format!("Bearer {}", valid_token))
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_admin_required_user_role_forbidden() {
        let state = create_test_state();
        let user_id = Uuid::new_v4();
        let user_token = generate_access_token(
            user_id,
            "regular_user@scamshield.local",
            "user",
            &state.config.jwt_secret,
            900,
        ).unwrap();

        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/admin/metrics")
            .header(AUTHORIZATION, format!("Bearer {}", user_token))
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn test_admin_required_admin_role_success() {
        let state = create_test_state();
        let admin_id = Uuid::new_v4();
        let admin_token = generate_access_token(
            admin_id,
            "admin@scamshield.local",
            "admin",
            &state.config.jwt_secret,
            900,
        ).unwrap();

        let app = test_app(state);

        let req = Request::builder()
            .uri("/api/admin/metrics")
            .header(AUTHORIZATION, format!("Bearer {}", admin_token))
            .body(Body::empty())
            .unwrap();

        let res = app.oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
    }
}
