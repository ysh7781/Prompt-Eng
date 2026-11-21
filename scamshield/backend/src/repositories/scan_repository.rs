use chrono::DateTime;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    dto::scanner_dto::ScanHistoryItem,
    error::AppResult,
    models::{Scan, ScanFinding},
};

pub struct ScanRepository {
    db: PgPool,
}

impl ScanRepository {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn create_scan(
        &self,
        user_id: Uuid,
        input_type: &str,
        input_content: Option<&str>,
        risk_score: i32,
        risk_level: &str,
    ) -> AppResult<Scan> {
        let scan = sqlx::query_as::<_, Scan>(
            r#"
            INSERT INTO scans (user_id, input_type, input_content, risk_score, risk_level)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_id, input_type, input_content, risk_score, risk_level, analyzed_at
            "#
        )
        .bind(user_id)
        .bind(input_type)
        .bind(input_content)
        .bind(risk_score)
        .bind(risk_level)
        .fetch_one(&self.db)
        .await?;

        Ok(scan)
    }

    pub async fn create_finding(
        &self,
        scan_id: Uuid,
        rule_code: &str,
        category: &str,
        description: &str,
        severity: &str,
        score_contribution: i32,
        evidence: Option<&str>,
    ) -> AppResult<ScanFinding> {
        let finding = sqlx::query_as::<_, ScanFinding>(
            r#"
            INSERT INTO scan_findings (scan_id, rule_code, category, description, severity, score_contribution, evidence)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, scan_id, rule_code, category, description, severity, score_contribution, evidence, created_at
            "#
        )
        .bind(scan_id)
        .bind(rule_code)
        .bind(category)
        .bind(description)
        .bind(severity)
        .bind(score_contribution)
        .bind(evidence)
        .fetch_one(&self.db)
        .await?;

        Ok(finding)
    }

    pub async fn get_findings_for_scan(&self, scan_id: Uuid) -> AppResult<Vec<ScanFinding>> {
        let findings = sqlx::query_as::<_, ScanFinding>(
            r#"
            SELECT id, scan_id, rule_code, category, description, severity, score_contribution, evidence, created_at
            FROM scan_findings
            WHERE scan_id = $1
            ORDER BY score_contribution DESC
            "#
        )
        .bind(scan_id)
        .fetch_all(&self.db)
        .await?;

        Ok(findings)
    }

    pub async fn list_user_scans(
        &self,
        user_id: Uuid,
        page: i64,
        page_size: i64,
    ) -> AppResult<Vec<ScanHistoryItem>> {
        let offset = (page - 1) * page_size;

        #[derive(sqlx::FromRow)]
        struct ScanRow {
            id: Uuid,
            input_type: String,
            input_content: Option<String>,
            risk_score: i32,
            risk_level: String,
            analyzed_at: DateTime<Utc>,
            finding_count: Option<i64>,
        }

        let items = sqlx::query_as::<_, ScanRow>(
            r#"
            SELECT s.id, s.input_type, s.input_content, s.risk_score, s.risk_level, s.analyzed_at,
                   COUNT(sf.id) as finding_count
            FROM scans s
            LEFT JOIN scan_findings sf ON sf.scan_id = s.id
            WHERE s.user_id = $1
            GROUP BY s.id
            ORDER BY s.analyzed_at DESC
            LIMIT $2 OFFSET $3
            "#
        )
        .bind(user_id)
        .bind(page_size)
        .bind(offset)
        .fetch_all(&self.db)
        .await?;

        let result = items
            .into_iter()
            .map(|r| ScanHistoryItem {
                id: r.id,
                input_type: r.input_type,
                input_content: r.input_content,
                risk_score: r.risk_score,
                risk_level: r.risk_level,
                finding_count: r.finding_count.unwrap_or(0),
                analyzed_at: r.analyzed_at,
            })
            .collect();

        Ok(result)
    }

    pub async fn count_user_scans(&self, user_id: Uuid) -> AppResult<i64> {
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM scans WHERE user_id = $1")
            .bind(user_id)
            .fetch_one(&self.db)
            .await?;

        Ok(count)
    }

    pub async fn get_user_stats(&self, user_id: Uuid) -> AppResult<crate::dto::DashboardStats> {
        let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM scans WHERE user_id = $1")
            .bind(user_id)
            .fetch_one(&self.db)
            .await?;

        let high_risk: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM scans WHERE user_id = $1 AND risk_level IN ('high', 'critical')"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        let moderate_risk: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM scans WHERE user_id = $1 AND risk_level = 'moderate'"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        let low_risk: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM scans WHERE user_id = $1 AND risk_level = 'low'"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        let today: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM scans WHERE user_id = $1 AND analyzed_at >= NOW() - INTERVAL '1 day'"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        let week: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM scans WHERE user_id = $1 AND analyzed_at >= NOW() - INTERVAL '7 days'"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        let avg: Option<f64> = sqlx::query_scalar(
            "SELECT AVG(risk_score::float8) FROM scans WHERE user_id = $1"
        )
        .bind(user_id)
        .fetch_one(&self.db)
        .await?;

        Ok(crate::dto::DashboardStats {
            total_scans: total,
            high_risk_scans: high_risk,
            moderate_risk_scans: moderate_risk,
            low_risk_scans: low_risk,
            scans_today: today,
            scans_this_week: week,
            average_risk_score: avg.unwrap_or(0.0),
        })
    }

    pub async fn get_risk_distribution(&self, user_id: Uuid) -> AppResult<Vec<crate::dto::RiskDistribution>> {
        let total: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM scans WHERE user_id = $1")
            .bind(user_id)
            .fetch_one(&self.db)
            .await?;

        if total == 0 {
            return Ok(vec![]);
        }

        #[derive(sqlx::FromRow)]
        struct RiskRow {
            risk_level: String,
            count: Option<i64>,
        }

        let rows = sqlx::query_as::<_, RiskRow>(
            r#"
            SELECT risk_level, COUNT(*) as count
            FROM scans
            WHERE user_id = $1
            GROUP BY risk_level
            ORDER BY count DESC
            "#
        )
        .bind(user_id)
        .fetch_all(&self.db)
        .await?;

        let result = rows
            .into_iter()
            .map(|r| {
                let count = r.count.unwrap_or(0);
                crate::dto::RiskDistribution {
                    risk_level: r.risk_level,
                    count,
                    percentage: (count as f64 / total as f64) * 100.0,
                }
            })
            .collect();

        Ok(result)
    }

    pub async fn get_top_findings(&self, user_id: Uuid) -> AppResult<Vec<crate::dto::TopFinding>> {
        #[derive(sqlx::FromRow)]
        struct FindingCountRow {
            rule_code: String,
            category: String,
            description: String,
            count: Option<i64>,
        }

        let rows = sqlx::query_as::<_, FindingCountRow>(
            r#"
            SELECT sf.rule_code, sf.category, sf.description, COUNT(*) as count
            FROM scan_findings sf
            JOIN scans s ON s.id = sf.scan_id
            WHERE s.user_id = $1
            GROUP BY sf.rule_code, sf.category, sf.description
            ORDER BY count DESC
            LIMIT 10
            "#
        )
        .bind(user_id)
        .fetch_all(&self.db)
        .await?;

        let result = rows
            .into_iter()
            .map(|r| crate::dto::TopFinding {
                rule_code: r.rule_code,
                category: r.category,
                description: r.description,
                count: r.count.unwrap_or(0),
            })
            .collect();

        Ok(result)
    }

    pub async fn count_total(&self) -> AppResult<i64> {
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM scans")
            .fetch_one(&self.db)
            .await?;
        Ok(count)
    }

    pub async fn get_scan_by_id(&self, scan_id: Uuid, user_id: Uuid) -> AppResult<Option<Scan>> {
        let scan = sqlx::query_as::<_, Scan>(
            r#"
            SELECT id, user_id, input_type, input_content, risk_score, risk_level, analyzed_at
            FROM scans
            WHERE id = $1 AND user_id = $2
            "#
        )
        .bind(scan_id)
        .bind(user_id)
        .fetch_optional(&self.db)
        .await?;
        Ok(scan)
    }

    pub async fn delete_scan(&self, scan_id: Uuid, user_id: Uuid) -> AppResult<bool> {
        let result = sqlx::query("DELETE FROM scans WHERE id = $1 AND user_id = $2")
            .bind(scan_id)
            .bind(user_id)
            .execute(&self.db)
            .await?;
        Ok(result.rows_affected() > 0)
    }
}
