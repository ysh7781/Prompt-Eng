use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_scans: i64,
    pub high_risk_scans: i64,
    pub moderate_risk_scans: i64,
    pub low_risk_scans: i64,
    pub scans_today: i64,
    pub scans_this_week: i64,
    pub average_risk_score: f64,
}

#[derive(Debug, Serialize)]
pub struct RiskDistribution {
    pub risk_level: String,
    pub count: i64,
    pub percentage: f64,
}

#[derive(Debug, Serialize)]
pub struct TopFinding {
    pub rule_code: String,
    pub category: String,
    pub description: String,
    pub count: i64,
}

#[derive(Debug, Serialize)]
pub struct DashboardResponse {
    pub stats: DashboardStats,
    pub risk_distribution: Vec<RiskDistribution>,
    pub top_findings: Vec<TopFinding>,
}

#[derive(Debug, Serialize)]
pub struct AdminUserInfo {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String,
    pub total_scans: i64,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct AdminDashboardResponse {
    pub total_users: i64,
    pub total_scans: i64,
    pub users: Vec<AdminUserInfo>,
    pub dashboard: DashboardResponse,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRuleRequest {
    pub enabled: bool,
    pub weight: Option<i32>,
}

#[derive(Debug, Deserialize, validator::Validate)]
pub struct CreateRuleRequest {
    #[validate(length(min = 1, max = 100))]
    pub rule_code: String,
    #[validate(length(min = 1, max = 100))]
    pub category: String,
    #[validate(length(min = 1, max = 500))]
    pub description: String,
    pub weight: i32,
    #[validate(length(min = 1, max = 20))]
    pub severity: String,
    pub enabled: Option<bool>,
}

