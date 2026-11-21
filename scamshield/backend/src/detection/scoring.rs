use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Finding {
    pub rule_code: String,
    pub category: String,
    pub description: String,
    pub severity: String,
    pub score_contribution: i32,
    pub evidence: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScoreResult {
    pub score: i32,
    pub risk_level: String,
    pub findings: Vec<Finding>,
    pub recommendations: Vec<String>,
}

pub fn classify_risk(score: i32) -> &'static str {
    match score {
        0..=24 => "low",
        25..=49 => "moderate",
        50..=74 => "high",
        _ => "critical",
    }
}

pub fn calculate_score(findings: &[Finding]) -> i32 {
    use std::collections::HashSet;
    let mut seen_rules = HashSet::new();
    let mut total = 0;

    for f in findings {
        if seen_rules.insert(&f.rule_code) {
            total += f.score_contribution;
        }
    }

    total.min(100)
}

pub fn generate_recommendations(findings: &[Finding], risk_level: &str) -> Vec<String> {
    let mut recs = vec![];

    if risk_level == "critical" || risk_level == "high" {
        recs.push("Do not click any links in this message.".to_string());
        recs.push("Do not provide any personal information.".to_string());
        recs.push("Report this message to the relevant authority.".to_string());
    }

    for f in findings {
        match f.rule_code.as_str() {
            "CREDENTIAL_REQUEST" => {
                recs.push("Never share OTPs, PINs, or passwords with anyone over messages.".to_string());
            }
            "URGENT_ACCOUNT_THREAT" => {
                recs.push("Legitimate services will never threaten to block your account via SMS.".to_string());
            }
            "GOVERNMENT_IMPERSONATION" => {
                recs.push("Verify government communications through official websites or phone numbers.".to_string());
            }
            "FINANCIAL_IMPERSONATION" => {
                recs.push("Contact your bank directly using the number on your card to verify any claims.".to_string());
            }
            "SUSPICIOUS_URL_SHORTENER" | "MISLEADING_DOMAIN" | "IP_ADDRESS_URL" => {
                recs.push("Avoid clicking shortened or suspicious URLs; navigate directly to official websites.".to_string());
            }
            "HTTP_ONLY_URL" => {
                recs.push("Do not enter sensitive data on HTTP (non-HTTPS) websites.".to_string());
            }
            "PUNYCODE_DOMAIN" => {
                recs.push("Be cautious of domains using special characters that look like legitimate sites.".to_string());
            }
            _ => {}
        }
    }

    // Deduplicate
    recs.sort();
    recs.dedup();
    recs
}

pub fn build_score_result(findings: Vec<Finding>) -> ScoreResult {
    let score = calculate_score(&findings);
    let risk_level = classify_risk(score).to_string();
    let recommendations = generate_recommendations(&findings, &risk_level);

    ScoreResult {
        score,
        risk_level,
        findings,
        recommendations,
    }
}

