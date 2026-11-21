CREATE TABLE detection_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 10 CHECK (weight >= 0 AND weight <= 100),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_detection_rules_code ON detection_rules(rule_code);
CREATE INDEX idx_detection_rules_enabled ON detection_rules(enabled);

INSERT INTO detection_rules (rule_code, category, description, weight, severity) VALUES
('URGENT_ACCOUNT_THREAT', 'urgency', 'Message contains urgent account-blocking threats', 20, 'high'),
('CREDENTIAL_REQUEST', 'credential_theft', 'Message requests sensitive credentials (OTP, PIN, password)', 30, 'critical'),
('SUSPICIOUS_URL_SHORTENER', 'url', 'URL uses a known link shortening service', 15, 'medium'),
('MISLEADING_DOMAIN', 'url', 'Domain uses misleading patterns to impersonate legitimate sites', 25, 'high'),
('PRIZE_SCAM_LANGUAGE', 'financial', 'Message contains prize or lottery scam language', 15, 'medium'),
('FINANCIAL_IMPERSONATION', 'impersonation', 'Message impersonates a financial institution', 20, 'high'),
('HTTP_ONLY_URL', 'url', 'URL uses insecure HTTP protocol', 10, 'low'),
('IP_ADDRESS_URL', 'url', 'URL uses an IP address instead of a domain name', 20, 'high'),
('EXCESSIVE_SUBDOMAINS', 'url', 'URL contains an unusually high number of subdomains', 15, 'medium'),
('SUSPICIOUS_TLD', 'url', 'URL uses a suspicious top-level domain', 10, 'medium'),
('GOVERNMENT_IMPERSONATION', 'impersonation', 'Message impersonates a government organization', 25, 'critical'),
('DELIVERY_SCAM', 'impersonation', 'Message impersonates a delivery or courier company', 15, 'medium'),
('PAYMENT_FAILURE_SCAM', 'financial', 'Message falsely claims a payment has failed', 15, 'high'),
('UNUSUAL_ENCODING', 'url', 'URL contains unusual percent-encoding or unicode tricks', 20, 'high'),
('PUNYCODE_DOMAIN', 'url', 'URL uses punycode encoding which may indicate IDN homograph attack', 25, 'high');

