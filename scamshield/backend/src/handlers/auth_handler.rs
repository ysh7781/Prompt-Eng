use axum::{
    body::Bytes,
    extract::{Extension, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::cookie::{Cookie, CookieJar, SameSite};
use validator::Validate;

use crate::{
    dto::auth_dto::{LoginRequest, RefreshTokenRequest, RegisterRequest, UserResponse},
    error::{AppError, AppResult},
    repositories::UserRepository,
    services::AuthService,
    state::AppState,
    utils::Claims,
};

fn build_refresh_cookie(token: String, max_age_seconds: i64) -> Cookie<'static> {
    Cookie::build(("refresh_token", token))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .max_age(time::Duration::seconds(max_age_seconds))
        .build()
}

fn build_removal_cookie() -> Cookie<'static> {
    Cookie::build(("refresh_token", ""))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .max_age(time::Duration::seconds(0))
        .build()
}

pub async fn register(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(req): Json<RegisterRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.register(req).await?;
    let cookie = build_refresh_cookie(
        response.refresh_token.clone(),
        state.config.jwt_refresh_expiry_seconds,
    );

    Ok((StatusCode::CREATED, jar.add(cookie), Json(response)))
}

pub async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(req): Json<LoginRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.login(req).await?;
    let cookie = build_refresh_cookie(
        response.refresh_token.clone(),
        state.config.jwt_refresh_expiry_seconds,
    );

    Ok((StatusCode::OK, jar.add(cookie), Json(response)))
}

pub async fn refresh_token(
    State(state): State<AppState>,
    jar: CookieJar,
    body: Bytes,
) -> AppResult<impl IntoResponse> {
    let token_from_body: Option<String> = if !body.is_empty() {
        serde_json::from_slice::<RefreshTokenRequest>(&body)
            .ok()
            .and_then(|r| r.refresh_token)
            .filter(|t| !t.trim().is_empty())
    } else {
        None
    };

    let token = token_from_body
        .or_else(|| jar.get("refresh_token").map(|c| c.value().to_string()))
        .ok_or_else(|| AppError::Unauthorized("Refresh token is required".to_string()))?;

    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.refresh_token(&token).await?;
    let cookie = build_refresh_cookie(
        response.refresh_token.clone(),
        state.config.jwt_refresh_expiry_seconds,
    );

    Ok((StatusCode::OK, jar.add(cookie), Json(response)))
}

pub async fn logout(
    State(state): State<AppState>,
    jar: CookieJar,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    service.logout(claims.sub).await?;
    let removal_cookie = build_removal_cookie();

    Ok((jar.add(removal_cookie), StatusCode::NO_CONTENT))
}

pub async fn me(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let user_repo = UserRepository::new(state.db.clone());
    let user = user_repo
        .find_by_id(claims.sub)
        .await?
        .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

    Ok(Json(UserResponse {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
    }))
}
