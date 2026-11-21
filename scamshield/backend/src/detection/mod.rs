pub mod keyword_rules;
pub mod url_rules;
pub mod message_rules;
pub mod scoring;
pub mod analyzer;

pub use analyzer::Analyzer;
pub use scoring::{ScoreResult, Finding};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_risk_classification() {
        assert_eq!(scoring::classify_risk(0), "low");
        assert_eq!(scoring::classify_risk(24), "low");
        assert_eq!(scoring::classify_risk(25), "moderate");
        assert_eq!(scoring::classify_risk(49), "moderate");
        assert_eq!(scoring::classify_risk(50), "high");
        assert_eq!(scoring::classify_risk(74), "high");
        assert_eq!(scoring::classify_risk(75), "critical");
        assert_eq!(scoring::classify_risk(100), "critical");
    }

    #[test]
    fn test_credential_keyword_detection() {
        let findings = keyword_rules::check_keywords("Please share your OTP and password immediately");
        assert!(findings.iter().any(|f| f.rule_code == "CREDENTIAL_REQUEST"));
        assert_eq!(findings.iter().find(|f| f.rule_code == "CREDENTIAL_REQUEST").unwrap().severity, "critical");
    }

    #[test]
    fn test_urgency_detection() {
        let findings = keyword_rules::check_keywords("Your account is suspended immediately, act now!");
        assert!(findings.iter().any(|f| f.rule_code == "URGENT_ACCOUNT_THREAT"));
        assert_eq!(findings.iter().find(|f| f.rule_code == "URGENT_ACCOUNT_THREAT").unwrap().score_contribution, 20);
    }

    #[test]
    fn test_financial_scam_detection() {
        let findings = keyword_rules::check_keywords("Congratulations you won a lottery prize reward!");
        assert!(findings.iter().any(|f| f.rule_code == "PRIZE_SCAM_LANGUAGE"));
    }

    #[test]
    fn test_financial_impersonation() {
        let findings = keyword_rules::check_keywords("Your Maybank bank account is blocked, verify immediately");
        assert!(findings.iter().any(|f| f.rule_code == "FINANCIAL_IMPERSONATION"));
    }

    #[test]
    fn test_government_impersonation() {
        let findings = keyword_rules::check_keywords("PDRM police notice: summons issued for immediate settlement");
        assert!(findings.iter().any(|f| f.rule_code == "GOVERNMENT_IMPERSONATION"));
        assert_eq!(findings.iter().find(|f| f.rule_code == "GOVERNMENT_IMPERSONATION").unwrap().severity, "critical");
    }

    #[test]
    fn test_delivery_scam() {
        let findings = keyword_rules::check_keywords("Pos Laju: Your parcel delivery is suspended. Pay customs fee immediately.");
        assert!(findings.iter().any(|f| f.rule_code == "DELIVERY_SCAM"));
    }

    #[test]
    fn test_payment_failure_scam() {
        let findings = keyword_rules::check_keywords("Billing issue: your monthly subscription payment failed. Update payment method.");
        assert!(findings.iter().any(|f| f.rule_code == "PAYMENT_FAILURE_SCAM"));
    }

    #[test]
    fn test_url_ip_detection() {
        let findings = url_rules::analyze_url("http://192.168.1.1/phish");
        assert!(findings.iter().any(|f| f.rule_code == "IP_ADDRESS_URL"));
    }

    #[test]
    fn test_url_shortener_detection() {
        let findings = url_rules::analyze_url("https://bit.ly/3xSample");
        assert!(findings.iter().any(|f| f.rule_code == "SUSPICIOUS_URL_SHORTENER"));
    }

    #[test]
    fn test_url_suspicious_tld() {
        let findings = url_rules::analyze_url("http://update-secure-login.tk");
        assert!(findings.iter().any(|f| f.rule_code == "SUSPICIOUS_TLD"));
    }

    #[test]
    fn test_url_misleading_domain() {
        let findings = url_rules::analyze_url("https://paypal-verify.account-update.com");
        assert!(findings.iter().any(|f| f.rule_code == "MISLEADING_DOMAIN"));
    }

    #[test]
    fn test_url_legitimate_domain_not_misleading() {
        let findings = url_rules::analyze_url("https://www.paypal.com/signin");
        assert!(!findings.iter().any(|f| f.rule_code == "MISLEADING_DOMAIN"));
    }

    #[test]
    fn test_url_punycode_detection() {
        let findings = url_rules::analyze_url("https://xn--apple-43a.com/verify");
        assert!(findings.iter().any(|f| f.rule_code == "PUNYCODE_DOMAIN"));
    }

    #[test]
    fn test_url_unusual_encoding() {
        let findings = url_rules::analyze_url("http://google.com%252f%252f@attacker.com/evil");
        assert!(findings.iter().any(|f| f.rule_code == "UNUSUAL_ENCODING"));
    }

    #[test]
    fn test_url_excessive_subdomains() {
        let findings = url_rules::analyze_url("https://a.b.c.d.e.malicious-server.com/login");
        assert!(findings.iter().any(|f| f.rule_code == "EXCESSIVE_SUBDOMAINS"));
    }

    #[test]
    fn test_url_http_only() {
        let findings = url_rules::analyze_url("http://legitimate-looking.org/data");
        assert!(findings.iter().any(|f| f.rule_code == "HTTP_ONLY_URL"));
    }

    #[test]
    fn test_url_parsing_invalid() {
        let findings = url_rules::analyze_url("not a valid url");
        assert!(findings.iter().any(|f| f.rule_code == "INVALID_URL"));
    }

    #[test]
    fn test_message_extract_urls() {
        let text = "Check out https://example.com/login. Also visit http://malicious.tk/test, and bit.ly/short.";
        let urls = message_rules::extract_urls(text);
        assert_eq!(urls.len(), 3);
        assert!(urls.contains(&"https://example.com/login".to_string()));
        assert!(urls.contains(&"http://malicious.tk/test".to_string()));
        assert!(urls.contains(&"bit.ly/short".to_string()));
    }

    #[test]
    fn test_message_minimal_text_with_url() {
        let findings = message_rules::analyze_message_structure("Click https://tinyurl.com/xyz");
        assert!(findings.iter().any(|f| f.rule_code == "MINIMAL_TEXT_WITH_URL"));
    }

    #[test]
    fn test_risk_score_calculation_capping() {
        let findings = vec![
            Finding {
                rule_code: "RULE_1".to_string(),
                category: "test".to_string(),
                description: "Test".to_string(),
                severity: "high".to_string(),
                score_contribution: 60,
                evidence: None,
            },
            Finding {
                rule_code: "RULE_2".to_string(),
                category: "test".to_string(),
                description: "Test".to_string(),
                severity: "critical".to_string(),
                score_contribution: 70,
                evidence: None,
            },
        ];
        let score = scoring::calculate_score(&findings);
        assert_eq!(score, 100); // 60 + 70 = 130, capped at 100
    }

    #[test]
    fn test_duplicate_rule_handling() {
        let findings = vec![
            Finding {
                rule_code: "CREDENTIAL_REQUEST".to_string(),
                category: "credential_theft".to_string(),
                description: "OTP request".to_string(),
                severity: "critical".to_string(),
                score_contribution: 30,
                evidence: Some("otp".to_string()),
            },
            Finding {
                rule_code: "CREDENTIAL_REQUEST".to_string(),
                category: "credential_theft".to_string(),
                description: "PIN request".to_string(),
                severity: "critical".to_string(),
                score_contribution: 30,
                evidence: Some("pin".to_string()),
            },
        ];
        // Duplicate rule triggers should only count once towards score
        let score = scoring::calculate_score(&findings);
        assert_eq!(score, 30);
    }

    #[test]
    fn test_analyzer_full_phishing_message() {
        let analyzer = Analyzer::new();
        let text = "URGENT: Your Maybank bank account has been suspended! Verify your OTP and login password now at http://maybank-verify.account-update.tk/login";
        let result = analyzer.analyze_message(text);

        assert!(result.score >= 75);
        assert_eq!(result.risk_level, "critical");
        assert!(result.findings.iter().any(|f| f.rule_code == "URGENT_ACCOUNT_THREAT"));
        assert!(result.findings.iter().any(|f| f.rule_code == "CREDENTIAL_REQUEST"));
        assert!(result.findings.iter().any(|f| f.rule_code == "FINANCIAL_IMPERSONATION"));
        assert!(result.findings.iter().any(|f| f.rule_code == "SUSPICIOUS_TLD"));
        assert!(result.findings.iter().any(|f| f.rule_code == "HTTP_ONLY_URL"));
        assert!(!result.recommendations.is_empty());
    }

    #[test]
    fn test_analyzer_safe_message() {
        let analyzer = Analyzer::new();
        let text = "Hey, are we still meeting for lunch at 1pm tomorrow?";
        let result = analyzer.analyze_message(text);

        assert_eq!(result.score, 0);
        assert_eq!(result.risk_level, "low");
        assert!(result.findings.is_empty());
        assert!(!result.recommendations.is_empty());
    }

    #[test]
    fn test_analyzer_url_phishing() {
        let analyzer = Analyzer::new();
        let url = "http://192.168.1.1/paypal-verify/update-password.php";
        let result = analyzer.analyze_url(url);

        assert!(result.findings.iter().any(|f| f.rule_code == "IP_ADDRESS_URL"));
        assert!(result.findings.iter().any(|f| f.rule_code == "HTTP_ONLY_URL"));
        assert!(result.score >= 30);
    }
}
