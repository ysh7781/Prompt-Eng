use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Scan {
    pub id: Uuid,
    pub user_id: Uuid,
    pub input_type: String,
    pub input_content: Option<String>,
    pub risk_score: i32,
    pub risk_level: String,
    pub analyzed_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ScanFinding {
    pub id: Uuid,
    pub scan_id: Uuid,
    pub rule_code: String,
    pub category: String,
    pub description: String,
    pub severity: String,
    pub score_contribution: i32,
    pub evidence: Option<String>,
    pub created_at: DateTime<Utc>,
}

