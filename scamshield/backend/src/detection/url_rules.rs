use once_cell::sync::Lazy;
use regex::Regex;
use url::Url;

use super::scoring::Finding;

static URL_SHORTENER_DOMAINS: &[&str] = &[
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "buff.ly",
    "adf.ly", "short.link", "tiny.cc", "is.gd", "v.gd", "cutt.ly",
    "rb.gy", "url.ie", "shorturl.at", "bl.ink", "tiny.one",
];

static SUSPICIOUS_TLDS: &[&str] = &[
    ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".xyz", ".club",
    ".online", ".site", ".website", ".link", ".click", ".buzz",
    ".rest", ".work",
];

static SUSPICIOUS_PATTERNS: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)(secure|login|verify|verification|account|update|confirm|banking|maybank|cimb|paypal|amazon|apple|google|microsoft|netflix)[-_.]").unwrap()
});

static UNUSUAL_ENCODING: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(%[0-9a-fA-F]{2}){3,}|%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}").unwrap()
});

const LEGITIMATE_BRANDS: &[(&str, &str)] = &[
    ("paypal", "paypal.com"),
    ("amazon", "amazon.com"),
    ("apple", "apple.com"),
    ("google", "google.com"),
    ("microsoft", "microsoft.com"),
    ("netflix", "netflix.com"),
    ("maybank", "maybank2u.com.my"),
    ("cimb", "cimbclicks.com.my"),
];

pub fn analyze_url(raw_url: &str) -> Vec<Finding> {
    let mut findings = vec![];

    // Check for punycode encoding in raw input early (even if IDNA parsing rejects malformed punycode)
    let has_punycode_in_raw = raw_url.contains("xn--");
    if has_punycode_in_raw {
        findings.push(Finding {
            rule_code: "PUNYCODE_DOMAIN".to_string(),
            category: "url".to_string(),
            description: "URL uses punycode encoding which may indicate IDN homograph attack".to_string(),
            severity: "high".to_string(),
            score_contribution: 25,
            evidence: Some(raw_url.to_string()),
        });
    }

    // Handle URLs both with and without explicit scheme (e.g. "bit.ly/abc" vs "https://bit.ly/abc")
    let (parsed, is_scheme_inferred) = match Url::parse(raw_url) {
        Ok(u) => (u, false),
        Err(_) => {
            if !raw_url.contains("://") && !raw_url.contains(' ') && raw_url.contains('.') {
                match Url::parse(&format!("https://{}", raw_url)) {
                    Ok(u) => (u, true),
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
                }
            } else {
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
        }
    };

    // 1. Insecure Protocol Check (HTTP only)
    if !is_scheme_inferred && parsed.scheme() == "http" {
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

    // 2. Direct IP Address Host
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

    // 3. Known URL Shortener
    let host_lower = host.to_lowercase();
    if URL_SHORTENER_DOMAINS.iter().any(|d| host_lower == *d || host_lower.ends_with(&format!(".{}", d))) {
        findings.push(Finding {
            rule_code: "SUSPICIOUS_URL_SHORTENER".to_string(),
            category: "url".to_string(),
            description: "URL uses a known link shortening service".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence: Some(host.to_string()),
        });
    }

    // 4. Suspicious / Abused TLD
    if SUSPICIOUS_TLDS.iter().any(|tld| host_lower.ends_with(tld)) {
        findings.push(Finding {
            rule_code: "SUSPICIOUS_TLD".to_string(),
            category: "url".to_string(),
            description: "URL uses a suspicious top-level domain".to_string(),
            severity: "medium".to_string(),
            score_contribution: 10,
            evidence: Some(host.to_string()),
        });
    }

    // 5. Excessive Subdomains (e.g. login.secure.bank.update.evil.com)
    let subdomain_count = host.split('.').count();
    if subdomain_count > 4 && !is_ip_address(host) {
        findings.push(Finding {
            rule_code: "EXCESSIVE_SUBDOMAINS".to_string(),
            category: "url".to_string(),
            description: "URL contains an unusually high number of subdomains".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence: Some(format!("{} subdomains in {}", subdomain_count - 1, host)),
        });
    }

    // 6. Punycode / IDN Homograph Attack in parsed host
    let has_non_ascii_host = host.chars().any(|c| !c.is_ascii());
    let has_punycode_host = host.contains("xn--");
    if (has_non_ascii_host || has_punycode_host) && !has_punycode_in_raw {
        findings.push(Finding {
            rule_code: "PUNYCODE_DOMAIN".to_string(),
            category: "url".to_string(),
            description: "URL uses punycode encoding which may indicate IDN homograph attack".to_string(),
            severity: "high".to_string(),
            score_contribution: 25,
            evidence: Some(host.to_string()),
        });
    }

    // 7. Unusual Percent Encoding or Embedded Authority Tricks
    let has_unusual_encoding = UNUSUAL_ENCODING.is_match(raw_url);
    let has_embedded_credentials = !parsed.username().is_empty() || parsed.password().is_some();
    if has_unusual_encoding || has_embedded_credentials {
        findings.push(Finding {
            rule_code: "UNUSUAL_ENCODING".to_string(),
            category: "url".to_string(),
            description: "URL contains unusual percent-encoding or authority confusion tricks".to_string(),
            severity: "high".to_string(),
            score_contribution: 20,
            evidence: Some(raw_url.to_string()),
        });
    }

    // 8. Misleading Domain / Brand Impersonation
    if is_misleading_domain(&host_lower) {
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

fn is_misleading_domain(host: &str) -> bool {
    // If it's a known legitimate domain, it's not misleading
    for (_brand, domain) in LEGITIMATE_BRANDS {
        if host == *domain || host.ends_with(&format!(".{}", domain)) {
            return false;
        }
    }

    // Check if host matches suspicious keywords or brand names in a non-authoritative domain
    SUSPICIOUS_PATTERNS.is_match(host)
}

fn is_ip_address(host: &str) -> bool {
    let h = host.trim_matches(|c| c == '[' || c == ']');
    h.parse::<std::net::IpAddr>().is_ok()
}
