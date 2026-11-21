use once_cell::sync::Lazy;
use regex::Regex;

use super::scoring::Finding;

static SCHEME_URL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r#"https?://[^\s<>"{}|\\^\[\]`]+"#).unwrap()
});

static BARE_DOMAIN_URL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r#"(?i)\b(?:[a-zA-Z0-9-]+\.)+(?:com|net|org|xyz|tk|ml|ga|cf|gq|top|club|online|site|website|link|click|io|me|co|ly|my|app|info)(?:/[^\s<>"{}|\\^\[\]`]*)?"#).unwrap()
});

fn clean_url(raw: &str) -> &str {
    raw.trim_end_matches(|c: char| c == '.' || c == ',' || c == ';' || c == ')' || c == ']' || c == '"' || c == '\'')
}

/// Extract all URLs from a message text, supporting both explicit schemes and bare domain links.
pub fn extract_urls(text: &str) -> Vec<String> {
    use std::collections::HashSet;
    let mut urls = Vec::new();
    let mut seen = HashSet::new();

    // 1. URLs with explicit http(s) scheme
    for m in SCHEME_URL_PATTERN.find_iter(text) {
        let cleaned = clean_url(m.as_str()).to_string();
        if !cleaned.is_empty() && seen.insert(cleaned.clone()) {
            urls.push(cleaned);
        }
    }

    // 2. Bare domain links (e.g. bit.ly/123, secure-login.xyz/verify)
    for m in BARE_DOMAIN_URL_PATTERN.find_iter(text) {
        let cleaned = clean_url(m.as_str()).to_string();
        // Avoid adding duplicate if it was already matched as part of an http(s) URL
        if !cleaned.is_empty()
            && !urls.iter().any(|u| u.contains(&cleaned))
            && seen.insert(cleaned.clone())
        {
            urls.push(cleaned);
        }
    }

    urls
}

/// Analyze message structure for suspicious heuristics (e.g. minimal text with links).
pub fn analyze_message_structure(text: &str) -> Vec<Finding> {
    let mut findings = vec![];

    let urls = extract_urls(text);
    let mut text_without_urls = text.to_string();
    for u in &urls {
        text_without_urls = text_without_urls.replace(u, "");
    }
    let word_count = text_without_urls.split_whitespace().count();

    // Phishing messages often send only a link or 1-3 words (e.g. "Click here: bit.ly/xyz")
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
