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
    }

    #[test]
    fn test_urgency_detection() {
        let findings = keyword_rules::check_keywords("Your account is suspended immediately, act now!");
        assert!(findings.iter().any(|f| f.rule_code == "URGENT_ACCOUNT_THREAT"));
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
    fn test_url_parsing_invalid() {
        let findings = url_rules::analyze_url("not a valid url");
        assert!(findings.iter().any(|f| f.rule_code == "INVALID_URL"));
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
}
