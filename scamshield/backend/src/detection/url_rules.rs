use once_cell::sync::Lazy;
use regex::Regex;
use url::Url;

use super::scoring::Finding;

static URL_SHORTENER_DOMAINS: &[&str] = &[
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "buff.ly",
    "adf.ly", "short.link", "tiny.cc", "is.gd", "v.gd", "cutt.ly",
    "rb.gy", "url.ie", "shorturl.at",
];

static SUSPICIOUS_TLDS: &[&str] = &[
    ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".xyz", ".club",
    ".online", ".site", ".website", ".link", ".click",
];

static MISLEADING_KEYWORDS: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(secure|login|verify|account|update|confirm|banking|paypal|amazon|apple|google|microsoft|netflix)-?\.").unwrap()
});

static UNUSUAL_ENCODING: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(%[0-9a-fA-F]{2}){3,}|%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}").unwrap()
});

pub fn analyze_url(raw_url: &str) -> Vec<Finding> {
    let mut findings = vec![];

    let parsed = match Url::parse(raw_url) {
        Ok(u) => u,
        Err(_) => {
            findings.push(Finding {
                rule_code: "INVALID_URL".to_string(),
                category: "url".to_string(),
                description: "URL could not be parsed".to_string(),
                severity: "medium".to_string(),
                score_contribution: 10,
                evidence: Some(raw_url.to_string()),
            });
            return findings;
        }
    };

    // HTTP only check
    if parsed.scheme() == "http" {
        findings.push(Finding {
            rule_code: "HTTP_ONLY_URL".to_string(),
            category: "url".to_string(),
            description: "URL uses insecure HTTP protocol".to_string(),
            severity: "low".to_string(),
            score_contribution: 10,
            evidence: Some(parsed.scheme().to_string()),
        });
    }

    let host = parsed.host_str().unwrap_or("");

    // IP address check
    if is_ip_address(host) {
        findings.push(Finding {
            rule_code: "IP_ADDRESS_URL".to_string(),
            category: "url".to_string(),
            description: "URL uses an IP address instead of a domain name".to_string(),
            severity: "high".to_string(),
            score_contribution: 20,
            evidence: Some(host.to_string()),
        });
    }

    // URL shortener check
    if URL_SHORTENER_DOMAINS.iter().any(|d| host == *d || host.ends_with(&format!(".{}", d))) {
        findings.push(Finding {
            rule_code: "SUSPICIOUS_URL_SHORTENER".to_string(),
            category: "url".to_string(),
            description: "URL uses a known link shortening service".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence: Some(host.to_string()),
        });
    }

    // Suspicious TLD check
    if SUSPICIOUS_TLDS.iter().any(|tld| host.ends_with(tld)) {
        findings.push(Finding {
            rule_code: "SUSPICIOUS_TLD".to_string(),
            category: "url".to_string(),
            description: "URL uses a suspicious top-level domain".to_string(),
            severity: "medium".to_string(),
            score_contribution: 10,
            evidence: Some(host.to_string()),
        });
    }

    // Excessive subdomains check
    let subdomain_count = host.split('.').count();
    if subdomain_count > 4 {
        findings.push(Finding {
            rule_code: "EXCESSIVE_SUBDOMAINS".to_string(),
            category: "url".to_string(),
            description: "URL contains an unusually high number of subdomains".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence: Some(format!("{} subdomains in {}", subdomain_count - 1, host)),
        });
    }

    // Punycode / IDN check
    if host.contains("xn--") {
        findings.push(Finding {
            rule_code: "PUNYCODE_DOMAIN".to_string(),
            category: "url".to_string(),
            description: "URL uses punycode encoding which may indicate IDN homograph attack".to_string(),
            severity: "high".to_string(),
            score_contribution: 25,
            evidence: Some(host.to_string()),
        });
    }

    // Unusual encoding check
    if UNUSUAL_ENCODING.is_match(raw_url) {
        findings.push(Finding {
            rule_code: "UNUSUAL_ENCODING".to_string(),
            category: "url".to_string(),
            description: "URL contains unusual percent-encoding or unicode tricks".to_string(),
            severity: "high".to_string(),
            score_contribution: 20,
            evidence: Some(raw_url.to_string()),
        });
    }

    // Misleading domain check
    if MISLEADING_KEYWORDS.is_match(host) {
        findings.push(Finding {
            rule_code: "MISLEADING_DOMAIN".to_string(),
            category: "url".to_string(),
            description: "Domain uses misleading patterns to impersonate legitimate sites".to_string(),
            severity: "high".to_string(),
            score_contribution: 25,
            evidence: Some(host.to_string()),
        });
    }

    findings
}

fn is_ip_address(host: &str) -> bool {
    // Strip brackets for IPv6
    let h = host.trim_matches(|c| c == '[' || c == ']');
    h.parse::<std::net::IpAddr>().is_ok()
}

