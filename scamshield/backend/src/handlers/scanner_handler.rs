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

    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
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

    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
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

    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
    let response = service.analyze(claims.sub, req).await?;

    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn get_history(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(params): Query<PaginationParams>,
) -> AppResult<impl IntoResponse> {
    let service = ScannerService::new(ScanRepository::new(state.db.clone()), state.config.gemini_api_key.clone());
    let response = service.get_history(claims.sub, params).await?;

    Ok(Json(response))
}

pub async fn demo_scan(
    State(state): State<AppState>,
    Json(req): Json<ScanRequest>,
) -> AppResult<impl IntoResponse> {
    req.validate()
        .map_err(|e| AppError::ValidationError(e.to_string()))?;

    let analyzer = crate::detection::Analyzer::with_gemini_key(state.config.gemini_api_key.clone());
    let result = match req.input_type {
        InputType::Message => analyzer.analyze_message_hybrid(&req.input).await,
        InputType::Url => analyzer.analyze_url_hybrid(&req.input).await,
    };

    let finding_responses: Vec<crate::dto::scanner_dto::FindingResponse> = result
        .findings
        .into_iter()
        .map(|f| crate::dto::scanner_dto::FindingResponse {
            rule_code: f.rule_code,
            category: f.category,
            description: f.description,
            severity: f.severity,
            score_contribution: f.score_contribution,
            evidence: f.evidence,
        })
        .collect();

    let response = crate::dto::scanner_dto::ScanResponse {
        id: uuid::Uuid::new_v4(),
        input_type: req.input_type.as_str().to_string(),
        risk_score: result.score,
        risk_level: result.risk_level,
        findings: finding_responses,
        recommendations: result.recommendations,
        analyzed_at: chrono::Utc::now(),
        ai_analysis: result.ai_analysis,
        is_ai_powered: result.is_ai_powered,
    };

    Ok((StatusCode::OK, Json(response)))
}

