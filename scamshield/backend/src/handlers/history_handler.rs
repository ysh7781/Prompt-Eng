use axum::{
    extract::{Extension, Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use uuid::Uuid;

use crate::{
    dto::scanner_dto::PaginationParams,
    error::{AppError, AppResult},
    repositories::ScanRepository,
    services::ScannerService,
    state::AppState,
    utils::Claims,
};

pub async fn list_history(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(params): Query<PaginationParams>,
) -> AppResult<impl IntoResponse> {
    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
    let response = service.get_history(claims.sub, params).await?;
    Ok(Json(response))
}

pub async fn get_scan_detail(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<Uuid>,
) -> AppResult<impl IntoResponse> {
    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
    let response = service.get_scan_detail(claims.sub, id).await?;
    Ok(Json(response))
}

pub async fn delete_scan(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(id): Path<Uuid>,
) -> AppResult<impl IntoResponse> {
    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
    let deleted = service.delete_scan(claims.sub, id).await?;
    if !deleted {
        return Err(AppError::NotFound("Scan not found".to_string()));
    }
    Ok(StatusCode::NO_CONTENT)
}

