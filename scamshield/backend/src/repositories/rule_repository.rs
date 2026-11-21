use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppResult,
    models::DetectionRule,
};

pub struct RuleRepository {
    db: PgPool,
}

impl RuleRepository {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn list_enabled(&self) -> AppResult<Vec<DetectionRule>> {
        let rules = sqlx::query_as::<_, DetectionRule>(
            r#"SELECT id, rule_code, category, description, weight, severity, enabled, created_at, updated_at
               FROM detection_rules WHERE enabled = true ORDER BY weight DESC"#
        )
        .fetch_all(&self.db)
        .await?;

        Ok(rules)
    }

    pub async fn list_all(&self) -> AppResult<Vec<DetectionRule>> {
        let rules = sqlx::query_as::<_, DetectionRule>(
            r#"SELECT id, rule_code, category, description, weight, severity, enabled, created_at, updated_at
               FROM detection_rules ORDER BY category, rule_code"#
        )
        .fetch_all(&self.db)
        .await?;

        Ok(rules)
    }

    pub async fn find_by_code(&self, rule_code: &str) -> AppResult<Option<DetectionRule>> {
        let rule = sqlx::query_as::<_, DetectionRule>(
            r#"SELECT id, rule_code, category, description, weight, severity, enabled, created_at, updated_at
               FROM detection_rules WHERE rule_code = $1"#
        )
        .bind(rule_code)
        .fetch_optional(&self.db)
        .await?;

        Ok(rule)
    }

    pub async fn update_rule(
        &self,
        id: Uuid,
        enabled: bool,
        weight: Option<i32>,
    ) -> AppResult<DetectionRule> {
        let rule = sqlx::query_as::<_, DetectionRule>(
            r#"
            UPDATE detection_rules
            SET enabled = $1, weight = COALESCE($2, weight), updated_at = NOW()
            WHERE id = $3
            RETURNING id, rule_code, category, description, weight, severity, enabled, created_at, updated_at
            "#
        )
        .bind(enabled)
        .bind(weight)
        .bind(id)
        .fetch_one(&self.db)
        .await?;

        Ok(rule)
    }

    pub async fn create_rule(
        &self,
        rule_code: &str,
        category: &str,
        description: &str,
        weight: i32,
        severity: &str,
        enabled: bool,
    ) -> AppResult<DetectionRule> {
        let rule = sqlx::query_as::<_, DetectionRule>(
            r#"
            INSERT INTO detection_rules (rule_code, category, description, weight, severity, enabled)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, rule_code, category, description, weight, severity, enabled, created_at, updated_at
            "#
        )
        .bind(rule_code)
        .bind(category)
        .bind(description)
        .bind(weight)
        .bind(severity)
        .bind(enabled)
        .fetch_one(&self.db)
        .await?;

        Ok(rule)
    }

    pub async fn delete_rule(&self, id: Uuid) -> AppResult<bool> {
        let result = sqlx::query("DELETE FROM detection_rules WHERE id = $1")
            .bind(id)
            .execute(&self.db)
            .await?;
        Ok(result.rows_affected() > 0)
    }
}
