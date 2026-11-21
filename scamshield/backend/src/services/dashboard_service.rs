use uuid::Uuid;

use crate::{
    dto::dashboard_dto::{AdminDashboardResponse, AdminUserInfo, DashboardResponse, UpdateRuleRequest},
    error::AppResult,
    models::DetectionRule,
    repositories::{RuleRepository, ScanRepository, UserRepository},
};

pub struct DashboardService {
    scan_repo: ScanRepository,
    user_repo: UserRepository,
    rule_repo: RuleRepository,
}

impl DashboardService {
    pub fn new(
        scan_repo: ScanRepository,
        user_repo: UserRepository,
        rule_repo: RuleRepository,
    ) -> Self {
        Self {
            scan_repo,
            user_repo,
            rule_repo,
        }
    }

    pub async fn get_user_dashboard(&self, user_id: Uuid) -> AppResult<DashboardResponse> {
        let stats = self.scan_repo.get_user_stats(user_id).await?;
        let risk_distribution = self.scan_repo.get_risk_distribution(user_id).await?;
        let top_findings = self.scan_repo.get_top_findings(user_id).await?;

        Ok(DashboardResponse {
            stats,
            risk_distribution,
            top_findings,
        })
    }

    pub async fn get_admin_dashboard(&self) -> AppResult<AdminDashboardResponse> {
        let total_users = self.user_repo.count().await?;
        let total_scans = self.scan_repo.count_total().await?;

        let users_with_counts = self.user_repo.list_with_scan_counts(50, 0).await?;

        let users: Vec<AdminUserInfo> = users_with_counts
            .into_iter()
            .map(|(u, count)| AdminUserInfo {
                id: u.id.to_string(),
                name: u.name,
                email: u.email,
                role: u.role,
                total_scans: count,
                created_at: u.created_at.to_rfc3339(),
            })
            .collect();

        // Build aggregate stats for admin using a nil UUID placeholder (all users)
        // For admin, we aggregate across all users
        let stats = crate::dto::DashboardStats {
            total_scans,
            high_risk_scans: 0,
            moderate_risk_scans: 0,
            low_risk_scans: 0,
            scans_today: 0,
            scans_this_week: 0,
            average_risk_score: 0.0,
        };

        let dashboard = DashboardResponse {
            stats,
            risk_distribution: vec![],
            top_findings: vec![],
        };

        Ok(AdminDashboardResponse {
            total_users,
            total_scans,
            users,
            dashboard,
        })
    }

    pub async fn get_stats(&self, user_id: Uuid) -> AppResult<crate::dto::DashboardStats> {
        self.scan_repo.get_user_stats(user_id).await
    }

    pub async fn get_recent_scans(&self, user_id: Uuid, limit: i64) -> AppResult<Vec<crate::dto::scanner_dto::ScanHistoryItem>> {
        self.scan_repo.list_user_scans(user_id, 1, limit).await
    }

    pub async fn get_risk_distribution(&self, user_id: Uuid) -> AppResult<Vec<crate::dto::RiskDistribution>> {
        self.scan_repo.get_risk_distribution(user_id).await
    }

    pub async fn list_rules(&self) -> AppResult<Vec<DetectionRule>> {
        self.rule_repo.list_all().await
    }

    pub async fn update_rule(&self, rule_id: Uuid, req: UpdateRuleRequest) -> AppResult<DetectionRule> {
        self.rule_repo.update_rule(rule_id, req.enabled, req.weight).await
    }

    pub async fn create_rule(&self, req: crate::dto::dashboard_dto::CreateRuleRequest) -> AppResult<DetectionRule> {
        self.rule_repo
            .create_rule(
                &req.rule_code,
                &req.category,
                &req.description,
                req.weight,
                &req.severity,
                req.enabled.unwrap_or(true),
            )
            .await
    }

    pub async fn delete_rule(&self, rule_id: Uuid) -> AppResult<bool> {
        self.rule_repo.delete_rule(rule_id).await
    }
}
