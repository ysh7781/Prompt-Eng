use once_cell::sync::Lazy;
use regex::Regex;

use super::scoring::Finding;

static URL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r#"https?://[^\s<>"{}|\\^\[\]`]+"#).unwrap()
});

/// Extract all URLs from a message text
pub fn extract_urls(text: &str) -> Vec<String> {
    URL_PATTERN
        .find_iter(text)
        .map(|m| m.as_str().to_string())
        .collect()
}

/// Analyze message structure for suspicious patterns
pub fn analyze_message_structure(text: &str) -> Vec<Finding> {
    let mut findings = vec![];

    // Check if message is very short but contains a URL (common in phishing)
    let urls = extract_urls(text);
    let text_without_urls = URL_PATTERN.replace_all(text, "").trim().to_string();
    let word_count = text_without_urls.split_whitespace().count();

    if !urls.is_empty() && word_count < 5 {
        findings.push(Finding {
            rule_code: "MINIMAL_TEXT_WITH_URL".to_string(),
            category: "structure".to_string(),
            description: "Message contains a URL with very little surrounding text".to_string(),
            severity: "low".to_string(),
            score_contribution: 5,
            evidence: Some(format!("{} word(s) with URL", word_count)),
        });
    }

    findings
}
