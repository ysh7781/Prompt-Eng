use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct ScanRequest {
    #[validate(length(min = 1, max = 10000, message = "Input must be between 1 and 10000 characters"))]
    pub input: String,
    pub input_type: InputType,
}

#[derive(Debug, Deserialize, Validate)]
pub struct ScanMessageRequest {
    #[validate(length(min = 1, max = 10000, message = "Content must be between 1 and 10000 characters"))]
    pub content: String,
    pub save_content: Option<bool>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct ScanUrlRequest {
    #[validate(length(min = 1, max = 2048, message = "URL must be between 1 and 2048 characters"))]
    pub url: String,
}

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum InputType {
    Message,
    Url,
}

impl InputType {
    pub fn as_str(&self) -> &'static str {
        match self {
            InputType::Message => "message",
            InputType::Url => "url",
        }
    }
}

#[derive(Debug, Serialize, Clone)]
pub struct FindingResponse {
    pub rule_code: String,
    pub category: String,
    pub description: String,
    pub severity: String,
    pub score_contribution: i32,
    pub evidence: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ScanResponse {
    pub id: Uuid,
    pub input_type: String,
    pub risk_score: i32,
    pub risk_level: String,
    pub findings: Vec<FindingResponse>,
    pub recommendations: Vec<String>,
    pub analyzed_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ScanHistoryItem {
    pub id: Uuid,
    pub input_type: String,
    pub input_content: Option<String>,
    pub risk_score: i32,
    pub risk_level: String,
    pub finding_count: i64,
    pub analyzed_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ScanHistoryResponse {
    pub items: Vec<ScanHistoryItem>,
    pub total: i64,
    pub page: i64,
    pub page_size: i64,
}

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    pub page: Option<i64>,
    pub page_size: Option<i64>,
}

