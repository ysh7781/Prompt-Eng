use axum::{
    extract::{Extension, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use validator::Validate;

use crate::{
    dto::auth_dto::{LoginRequest, RefreshTokenRequest, RegisterRequest},
    error::{AppError, AppResult},
    repositories::{UserRepository},
    services::AuthService,
    state::AppState,
    utils::Claims,
};

pub async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.register(req).await?;
    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.login(req).await?;
    Ok(Json(response))
}

pub async fn refresh_token(
    State(state): State<AppState>,
    Json(req): Json<RefreshTokenRequest>,
) -> AppResult<impl IntoResponse> {
    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    let response = service.refresh_token(&req.refresh_token).await?;
    Ok(Json(response))
}

pub async fn logout(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let service = AuthService::new(
        UserRepository::new(state.db.clone()),
        state.config.clone(),
    );

    service.logout(claims.sub).await?;
    Ok(StatusCode::NO_CONTENT)
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

    Ok(Json(crate::dto::auth_dto::UserResponse {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
    }))
}

