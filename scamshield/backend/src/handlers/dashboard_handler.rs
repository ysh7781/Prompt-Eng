use axum::{
    extract::{Extension, Path, Query, State},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    dto::dashboard_dto::UpdateRuleRequest,
    error::AppResult,
    repositories::{RuleRepository, ScanRepository, UserRepository},
    services::DashboardService,
    state::AppState,
    utils::Claims,
};

#[derive(Debug, Deserialize)]
pub struct RecentQuery {
    pub limit: Option<i64>,
}

pub async fn get_stats(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let stats = service.get_stats(claims.sub).await?;
    Ok(Json(stats))
}

pub async fn get_recent_scans(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Query(query): Query<RecentQuery>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let limit = query.limit.unwrap_or(5).min(50).max(1);
    let recent = service.get_recent_scans(claims.sub, limit).await?;
    Ok(Json(recent))
}

pub async fn get_risk_distribution(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let dist = service.get_risk_distribution(claims.sub).await?;
    Ok(Json(dist))
}

pub async fn get_dashboard(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let response = service.get_user_dashboard(claims.sub).await?;
    Ok(Json(response))
}

pub async fn get_admin_dashboard(
    State(state): State<AppState>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let response = service.get_admin_dashboard().await?;
    Ok(Json(response))
}

pub async fn list_rules(
    State(state): State<AppState>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let rules = service.list_rules().await?;
    Ok(Json(rules))
}

pub async fn update_rule(
    State(state): State<AppState>,
    Path(rule_id): Path<Uuid>,
    Json(req): Json<UpdateRuleRequest>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let rule = service.update_rule(rule_id, req).await?;
    Ok(Json(rule))
}

pub async fn create_rule(
    State(state): State<AppState>,
    Json(req): Json<crate::dto::dashboard_dto::CreateRuleRequest>,
) -> AppResult<impl IntoResponse> {
    use validator::Validate;
    req.validate()
        .map_err(|e| crate::error::AppError::ValidationError(e.to_string()))?;

    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let rule = service.create_rule(req).await?;
    Ok((axum::http::StatusCode::CREATED, Json(rule)))
}

pub async fn delete_rule(
    State(state): State<AppState>,
    Path(rule_id): Path<Uuid>,
) -> AppResult<impl IntoResponse> {
    let service = DashboardService::new(
        ScanRepository::new(state.db.clone()),
        UserRepository::new(state.db.clone()),
        RuleRepository::new(state.db.clone()),
    );

    let deleted = service.delete_rule(rule_id).await?;
    if !deleted {
        return Err(crate::error::AppError::NotFound("Rule not found".to_string()));
    }
    Ok(axum::http::StatusCode::NO_CONTENT)
}

