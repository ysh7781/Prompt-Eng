use once_cell::sync::Lazy;
use regex::Regex;

use super::scoring::Finding;

static CREDENTIAL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(otp|one.?time.?password|pin|password|passcode|cvv|2fa|credentials|login.?details|account.?details|verification.?code|security.?code|secret.?key)\b").unwrap()
});

static URGENT_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(urgent|urgently|immediately|immediate|block(ed)?|suspend(ed)?|deactivat(ed)?|restrict(ed)?|terminat(ed)?|lock(ed)?|expire[sd]?|expiring|act.?now|limited.?time|within.?\d+.?(hour|hr|minute|min)|in.?\d+.?(hour|hr|minute|min))\b").unwrap()
});

static PRIZE_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(won|winner|congratulations|prize|lottery|lucky.?draw|reward|cashback|free.?money|selected.?winner|claim.?your.?reward|gift.?card)\b").unwrap()
});

static FINANCIAL_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(bank|maybank|cimb|public.?bank|rhb|hong.?leong|ambank|bsn|affin|ocbc|standard.?chartered|hsbc|citibank|chase|wells.?fargo|paypal|financial.?institution|your.?bank.?account|credit.?card)\b").unwrap()
});

static GOVERNMENT_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(polis|police|pdrm|lhdn|kastam|customs|jabatan|kementerian|ministry|court|mahkamah|government|kerajaan|irs|doj|fbi|department.?of)\b").unwrap()
});

static DELIVERY_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(parcel|package|delivery|courier|pos.?laju|poslaju|dhl|fedex|ups|gdex|j&t|ninja.?van|shipment|customs.?fee|duty.?fee|unclaimed.?package|redelivery)\b").unwrap()
});

static PAYMENT_FAILURE_PATTERN: Lazy<Regex> = Lazy::new(|| {
    Regex::new(r"(?i)\b(payment.?fail(ed)?|transaction.?fail(ed)?|billing.?issue|payment.?declined|update.?payment|payment.?method|subscription.?cancel(led)?|unpaid.?invoice|overdue.?balance)\b").unwrap()
});

/// Evaluates input text against phishing keyword heuristics and extracts findings with evidence.
pub fn check_keywords(text: &str) -> Vec<Finding> {
    let mut findings = vec![];

    // 1. Sensitive Credentials Theft
    if CREDENTIAL_PATTERN.is_match(text) {
        let evidence = CREDENTIAL_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "CREDENTIAL_REQUEST".to_string(),
            category: "credential_theft".to_string(),
            description: "Message requests sensitive credentials (OTP, PIN, password)".to_string(),
            severity: "critical".to_string(),
            score_contribution: 30,
            evidence,
        });
    }

    // 2. Urgent Threat / Account Blocking Language
    if URGENT_PATTERN.is_match(text) {
        let evidence = URGENT_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "URGENT_ACCOUNT_THREAT".to_string(),
            category: "urgency".to_string(),
            description: "Message contains urgent account-blocking threats".to_string(),
            severity: "high".to_string(),
            score_contribution: 20,
            evidence,
        });
    }

    // 3. Prize / Lottery / Reward Scam
    if PRIZE_PATTERN.is_match(text) {
        let evidence = PRIZE_PATTERN.find(text).map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "PRIZE_SCAM_LANGUAGE".to_string(),
            category: "financial".to_string(),
            description: "Message contains prize or lottery scam language".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence,
        });
    }

    // 4. Financial Institution Impersonation
    if FINANCIAL_PATTERN.is_match(text) && (URGENT_PATTERN.is_match(text) || CREDENTIAL_PATTERN.is_match(text) || PRIZE_PATTERN.is_match(text)) {
        let evidence = FINANCIAL_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "FINANCIAL_IMPERSONATION".to_string(),
            category: "impersonation".to_string(),
            description: "Message impersonates a financial institution".to_string(),
            severity: "high".to_string(),
            score_contribution: 20,
            evidence,
        });
    }

    // 5. Government Agency Impersonation
    if GOVERNMENT_PATTERN.is_match(text) {
        let evidence = GOVERNMENT_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "GOVERNMENT_IMPERSONATION".to_string(),
            category: "impersonation".to_string(),
            description: "Message impersonates a government organization".to_string(),
            severity: "critical".to_string(),
            score_contribution: 25,
            evidence,
        });
    }

    // 6. Courier / Delivery Package Scam
    if DELIVERY_PATTERN.is_match(text) && (URGENT_PATTERN.is_match(text) || CREDENTIAL_PATTERN.is_match(text) || PAYMENT_FAILURE_PATTERN.is_match(text)) {
        let evidence = DELIVERY_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "DELIVERY_SCAM".to_string(),
            category: "impersonation".to_string(),
            description: "Message impersonates a delivery or courier company".to_string(),
            severity: "medium".to_string(),
            score_contribution: 15,
            evidence,
        });
    }

    // 7. Payment / Billing Failure Threat
    if PAYMENT_FAILURE_PATTERN.is_match(text) {
        let evidence = PAYMENT_FAILURE_PATTERN
            .find(text)
            .map(|m| m.as_str().to_string());
        findings.push(Finding {
            rule_code: "PAYMENT_FAILURE_SCAM".to_string(),
            category: "financial".to_string(),
            description: "Message falsely claims a payment has failed".to_string(),
            severity: "high".to_string(),
            score_contribution: 15,
            evidence,
        });
    }

    findings
}
