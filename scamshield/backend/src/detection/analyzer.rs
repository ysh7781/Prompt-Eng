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

    pub fn analyze_message(&self, text: &str) -> ScoreResult {
        let mut findings = vec![];

        // Run keyword detection
        findings.extend(keyword_rules::check_keywords(text));

        // Run message structure analysis
        findings.extend(message_rules::analyze_message_structure(text));

        // Extract URLs from text and analyze each
        let urls = message_rules::extract_urls(text);
        for url in &urls {
            let url_findings = url_rules::analyze_url(url);
            findings.extend(url_findings);
        }

        // Deduplicate findings by rule_code
        findings.dedup_by(|a, b| a.rule_code == b.rule_code);

        scoring::build_score_result(findings)
    }

    pub fn analyze_url(&self, url: &str) -> ScoreResult {
        let mut findings = url_rules::analyze_url(url);

        // Also run keyword checks on the URL itself (sometimes URLs contain keywords)
        findings.extend(keyword_rules::check_keywords(url));
        findings.dedup_by(|a, b| a.rule_code == b.rule_code);

        scoring::build_score_result(findings)
    }
}

impl Default for Analyzer {
    fn default() -> Self {
        Self::new()
    }
}

