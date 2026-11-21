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
        assert_eq!(scoring::classify_risk(5), "low");
        assert_eq!(scoring::classify_risk(35), "moderate");
        assert_eq!(scoring::classify_risk(65), "high");
        assert_eq!(scoring::classify_risk(85), "critical");
    }

    #[test]
    fn test_credential_keyword_detection() {
        let findings = keyword_rules::check_keywords("Please share your OTP immediately");
        assert!(!findings.is_empty());
    }

    #[test]
    fn test_url_ip_detection() {
        let findings = url_rules::analyze_url("http://192.168.1.1/phish");
        assert!(findings.iter().any(|f| f.rule_code == "IP_ADDRESS_URL"));
    }
}

