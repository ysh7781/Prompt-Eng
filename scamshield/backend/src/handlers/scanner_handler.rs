use axum::{
    extract::{Extension, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use validator::Validate;

use crate::{
    dto::scanner_dto::{InputType, PaginationParams, ScanMessageRequest, ScanRequest, ScanUrlRequest},
    error::{AppError, AppResult},
    repositories::ScanRepository,
    services::ScannerService,
    state::AppState,
    utils::Claims,
};

pub async fn scan_message(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Json(req): Json<ScanMessageRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let scan_req = ScanRequest {
        input: req.content,
        input_type: InputType::Message,
        save_content: req.save_content,
    };

    let service = ScannerService::new(ScanRepository::new(state.db.clone()));
    let response = service.analyze(claims.sub, scan_req).await?;

    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn scan_url(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Json(req): Json<ScanUrlRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let scan_req = ScanRequest {
        input: req.url,
        input_type: InputType::Url,
        save_content: Some(true),
    };

    let service = ScannerService::new(ScanRepository::new(state.db.clone()));
    let response = service.analyze(claims.sub, scan_req).await?;

    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn analyze(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Json(req): Json<ScanRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let service = ScannerService::new(ScanRepository::new(state.db.clone()));
    let response = service.analyze(claims.sub, req).await?;

    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn get_history(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(params): Query<PaginationParams>,
) -> AppResult<impl IntoResponse> {
    let service = ScannerService::new(ScanRepository::new(state.db.clone()));
    let response = service.get_history(claims.sub, params).await?;

    Ok(Json(response))
}

