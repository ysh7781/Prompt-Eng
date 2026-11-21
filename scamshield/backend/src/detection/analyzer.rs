use std::collections::HashSet;

use super::{
    keyword_rules,
    message_rules,
    scoring::{self, ScoreResult},
    url_rules,
};

pub struct Analyzer;

impl Analyzer {
    pub fn new() -> Self {
        Self
    }

    /// Performs full multi-layered threat analysis on a message body.
    pub fn analyze_message(&self, text: &str) -> ScoreResult {
        let mut findings = vec![];

        // 1. Keyword rules (credentials, urgency, prize, impersonation, delivery, payment)
        findings.extend(keyword_rules::check_keywords(text));

        // 2. Message structural heuristics (minimal text with links, etc.)
        findings.extend(message_rules::analyze_message_structure(text));

        // 3. URL extraction and recursive URL rule analysis
        let urls = message_rules::extract_urls(text);
        for url in &urls {
            let url_findings = url_rules::analyze_url(url);
            findings.extend(url_findings);
        }

        // 4. Complete deduplication by rule_code across all detectors
        let mut seen = HashSet::new();
        findings.retain(|f| seen.insert(f.rule_code.clone()));

        scoring::build_score_result(findings)
    }

    /// Performs deep structural and heuristic analysis on a target URL.
    pub fn analyze_url(&self, url: &str) -> ScoreResult {
        let mut findings = url_rules::analyze_url(url);

        // Also evaluate keywords within the URL path, query, and hostname
        findings.extend(keyword_rules::check_keywords(url));

        let mut seen = HashSet::new();
        findings.retain(|f| seen.insert(f.rule_code.clone()));

        scoring::build_score_result(findings)
    }
}

impl Default for Analyzer {
    fn default() -> Self {
        Self::new()
    }
}
