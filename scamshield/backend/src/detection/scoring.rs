use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Finding {
    pub rule_code: String,
    pub category: String,
    pub description: String,
    pub severity: String,
    pub score_contribution: i32,
    pub evidence: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ScoreResult {
    pub score: i32,
    pub risk_level: String,
    pub findings: Vec<Finding>,
    pub recommendations: Vec<String>,
    pub ai_analysis: Option<String>,
    pub is_ai_powered: bool,
}

/// Classifies numerical risk score into low, moderate, high, or critical.
pub fn classify_risk(score: i32) -> &'static str {
    match score {
        0..=24 => "low",
        25..=49 => "moderate",
        50..=74 => "high",
        _ => "critical",
    }
}

/// Calculates the aggregate risk score from findings with deduplication and 100 cap.
pub fn calculate_score(findings: &[Finding]) -> i32 {
    let mut seen_rules = HashSet::new();
    let mut total = 0;

    for f in findings {
        if seen_rules.insert(&f.rule_code) {
            total += f.score_contribution;
        }
    }

    total.min(100)
}

/// Generates tailored, actionable safety recommendations based on findings and risk level.
pub fn generate_recommendations(findings: &[Finding], risk_level: &str) -> Vec<String> {
    let mut recs = vec![];

    if risk_level == "critical" || risk_level == "high" {
        recs.push("Do not click any embedded links or open attachments.".to_string());
        recs.push("Never disclose passwords, OTPs, PINs, or banking credentials.".to_string());
        recs.push("Report this communication immediately to the relevant service or security team.".to_string());
    }

    for f in findings {
        match f.rule_code.as_str() {
            "CREDENTIAL_REQUEST" => {
                recs.push("Never share OTPs, PINs, or passwords with anyone over messages or unverified forms.".to_string());
            }
            "URGENT_ACCOUNT_THREAT" => {
                recs.push("Legitimate services will never threaten immediate account suspension via SMS or chat.".to_string());
            }
            "PRIZE_SCAM_LANGUAGE" => {
                recs.push("Ignore unsolicited lottery or prize claims; genuine sweepstakes do not demand advance fees or login details.".to_string());
            }
            "FINANCIAL_IMPERSONATION" => {
                recs.push("Contact your bank directly using the official telephone number on the back of your card.".to_string());
            }
            "GOVERNMENT_IMPERSONATION" => {
                recs.push("Verify official government notices directly via verified agency portals, never through message links.".to_string());
            }
            "DELIVERY_SCAM" => {
                recs.push("Track delivery parcels exclusively through the courier's official app or verified tracking portal.".to_string());
            }
            "PAYMENT_FAILURE_SCAM" => {
                recs.push("Check your bank statement or merchant billing history directly before authorizing any payments.".to_string());
            }
            "SUSPICIOUS_URL_SHORTENER" => {
                recs.push("Avoid clicking shortened URLs; navigate directly to official websites through a search engine or browser bookmark.".to_string());
            }
            "MISLEADING_DOMAIN" => {
                recs.push("Inspect the domain carefully: cybercriminals often use subdomains mimicking trusted brands.".to_string());
            }
            "IP_ADDRESS_URL" => {
                recs.push("Legitimate businesses do not host customer login pages directly on raw IP addresses.".to_string());
            }
            "HTTP_ONLY_URL" => {
                recs.push("Do not enter personal or financial data on unencrypted HTTP (non-HTTPS) websites.".to_string());
            }
            "SUSPICIOUS_TLD" => {
                recs.push("Exercise heightened caution with links using free or high-risk top-level domains.".to_string());
            }
            "EXCESSIVE_SUBDOMAINS" => {
                recs.push("Look at the root domain before the suffix: excessive subdomains are frequently used to disguise malicious destinations.".to_string());
            }
            "PUNYCODE_DOMAIN" => {
                recs.push("Be cautious of domains using special characters or Cyrillic letters that imitate legitimate brand names (IDN homograph attack).".to_string());
            }
            "UNUSUAL_ENCODING" => {
                recs.push("Be extremely cautious of obfuscated or heavily encoded link addresses designed to evade security filters.".to_string());
            }
            "MINIMAL_TEXT_WITH_URL" => {
                recs.push("Unsolicited messages containing only a bare link without context are a hallmark of automated spam.".to_string());
            }
            "INVALID_URL" => {
                recs.push("The destination link is malformed or improperly formatted; do not attempt to visit it.".to_string());
            }
            _ => {}
        }
    }

    if findings.is_empty() {
        recs.push("No known suspicious indicators detected. Continue practicing standard cyber hygiene.".to_string());
    }

    // Deduplicate and maintain clean ordering
    recs.sort();
    recs.dedup();
    recs
}

/// Builds a complete ScoreResult from a list of findings.
pub fn build_score_result(findings: Vec<Finding>) -> ScoreResult {
    let score = calculate_score(&findings);
    let risk_level = classify_risk(score).to_string();
    let recommendations = generate_recommendations(&findings, &risk_level);

    ScoreResult {
        score,
        risk_level,
        findings,
        recommendations,
        ai_analysis: None,
        is_ai_powered: false,
    }
}
