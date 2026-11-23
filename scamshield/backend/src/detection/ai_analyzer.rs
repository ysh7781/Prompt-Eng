use std::time::Duration;
use serde::{Deserialize, Serialize};
use tracing::{info, warn};

use super::scoring::{classify_risk, Finding, ScoreResult};

#[derive(Debug, Clone)]
pub struct AiAnalyzer {
    api_key: Option<String>,
    client: reqwest::Client,
}

#[derive(Serialize)]
struct GeminiRequest {
    #[serde(rename = "systemInstruction")]
    system_instruction: GeminiContent,
    contents: Vec<GeminiContent>,
    #[serde(rename = "generationConfig")]
    generation_config: GeminiGenerationConfig,
}

#[derive(Serialize, Deserialize)]
struct GeminiContent {
    parts: Vec<GeminiPart>,
}

#[derive(Serialize, Deserialize)]
struct GeminiPart {
    text: String,
}

#[derive(Serialize)]
struct GeminiGenerationConfig {
    #[serde(rename = "responseMimeType")]
    response_mime_type: String,
    temperature: f32,
}

#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Option<Vec<GeminiCandidate>>,
}

#[derive(Deserialize)]
struct GeminiCandidate {
    content: Option<GeminiContent>,
}

#[derive(Deserialize)]
struct AiAnalysisJson {
    risk_score: i32,
    risk_level: String,
    ai_analysis: String,
    findings: Vec<AiFindingJson>,
    recommendations: Vec<String>,
}

#[derive(Deserialize)]
struct AiFindingJson {
    rule_code: String,
    category: String,
    description: String,
    severity: String,
    score_contribution: i32,
    evidence: Option<String>,
}

impl AiAnalyzer {
    pub fn new(api_key: Option<String>) -> Self {
        let client = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .build()
            .unwrap_or_default();

        Self { api_key, client }
    }

    pub fn is_configured(&self) -> bool {
        self.api_key.as_ref().map(|k| !k.trim().is_empty()).unwrap_or(false)
    }

    pub async fn analyze_content(&self, input: &str, input_type: &str) -> Option<ScoreResult> {
        let api_key = match &self.api_key {
            Some(key) if !key.trim().is_empty() => key.trim(),
            _ => {
                info!("GEMINI_API_KEY is not set. Using deterministic heuristic detection engine.");
                return None;
            }
        };

        let system_prompt = r#"You are ScamLens AI, an elite cybersecurity fraud intelligence and social engineering detection engine.
Your purpose is to protect people from digital scams, phishing, social engineering, credential theft, and online fraud.
Analyze the SEMANTIC INTENT, context, conversational pressure, and manipulation tactics of the input, NOT just static word matching.

Identify techniques such as:
- Credential harvesting: Asking for OTPs, PINs, passwords, authentication codes, or login tokens under any pretext (e.g. order returns, package deliveries, account verification, prize claiming).
- Impersonation: Pretending to be an e-commerce platform, courier/delivery service (DHL, FedEx, Pos Laju), financial institution/bank, IT support, or government entity.
- Pretexting & Social Engineering: Fabricating false scenarios to exploit urgency, fear, helpfulness, or greed.
- Financial fraud: Unsolicited lotteries, investment/crypto doubling schemes, fake invoices, overpayment traps.
- Deceptive links: Phishing URLs, fake login portals, suspicious domains.

Output strictly valid JSON with this exact structure:
{
  "risk_score": <integer from 0 (completely safe) to 100 (extreme danger)>,
  "risk_level": "<low | moderate | high | critical>",
  "ai_analysis": "<2-3 clear, professional sentences explaining the detected intent, psychological manipulation, and why this is safe or dangerous>",
  "findings": [
    {
      "rule_code": "<UPPERCASE_SNAKE_CASE_CODE, e.g. AI_OTP_HARVESTING, AI_PRETEXTING, AI_URGENCY>",
      "category": "<credential_theft | urgency | impersonation | financial_fraud | malicious_link | social_engineering>",
      "description": "<Clear human-friendly description of what was detected>",
      "severity": "<low | medium | high | critical>",
      "score_contribution": <integer between 5 and 50 representing threat weight>,
      "evidence": "<exact quote or specific element from the input demonstrating the threat>"
    }
  ],
  "recommendations": [
    "<actionable safety advice 1>",
    "<actionable safety advice 2>"
  ]
}"#;

        let user_prompt = format!(
            "Input Type: {}\nInput Content to Analyze:\n\"\"\"\n{}\n\"\"\"\n\nPerform full AI cybersecurity threat and fraud analysis now.",
            input_type, input
        );

        let request_payload = GeminiRequest {
            system_instruction: GeminiContent {
                parts: vec![GeminiPart {
                    text: system_prompt.to_string(),
                }],
            },
            contents: vec![GeminiContent {
                parts: vec![GeminiPart { text: user_prompt }],
            }],
            generation_config: GeminiGenerationConfig {
                response_mime_type: "application/json".to_string(),
                temperature: 0.1,
            },
        };

        let endpoint = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={}",
            api_key
        );

        match self.client.post(&endpoint).json(&request_payload).send().await {
            Ok(response) => {
                let status = response.status();
                if !status.is_success() {
                    let err_body = response.text().await.unwrap_or_default();
                    warn!(
                        "Gemini API returned HTTP {}: {}. Falling back to heuristic analysis.",
                        status, err_body
                    );
                    return None;
                }

                let gemini_resp: GeminiResponse = match response.json().await {
                    Ok(resp) => resp,
                    Err(e) => {
                        warn!("Failed to parse Gemini API JSON response: {}. Falling back to heuristic analysis.", e);
                        return None;
                    }
                };

                let raw_json_text = gemini_resp
                    .candidates
                    .as_ref()
                    .and_then(|c| c.first())
                    .and_then(|cand| cand.content.as_ref())
                    .and_then(|cont| cont.parts.first())
                    .map(|p| p.text.as_str())?;

                match serde_json::from_str::<AiAnalysisJson>(raw_json_text) {
                    Ok(parsed) => {
                        let normalized_findings: Vec<Finding> = parsed
                            .findings
                            .into_iter()
                            .map(|f| {
                                let norm_severity = match f.severity.to_lowercase().as_str() {
                                    "critical" => "critical",
                                    "high" => "high",
                                    "moderate" | "medium" => "medium",
                                    _ => "low",
                                };

                                Finding {
                                    rule_code: f.rule_code,
                                    category: f.category,
                                    description: f.description,
                                    severity: norm_severity.to_string(),
                                    score_contribution: f.score_contribution.clamp(1, 100),
                                    evidence: f.evidence,
                                }
                            })
                            .collect();

                        let risk_level = match parsed.risk_level.to_lowercase().as_str() {
                            "critical" => "critical".to_string(),
                            "high" => "high".to_string(),
                            "moderate" => "moderate".to_string(),
                            "low" => "low".to_string(),
                            _ => classify_risk(parsed.risk_score).to_string(),
                        };

                        info!(
                            "AI threat scan completed: score={}, risk_level={}, findings={}",
                            parsed.risk_score,
                            risk_level,
                            normalized_findings.len()
                        );

                        Some(ScoreResult {
                            score: parsed.risk_score.clamp(0, 100),
                            risk_level,
                            findings: normalized_findings,
                            recommendations: parsed.recommendations,
                            ai_analysis: Some(parsed.ai_analysis),
                            is_ai_powered: true,
                        })
                    }
                    Err(e) => {
                        warn!(
                            "Failed to deserialize AI output into schema: {}. Raw text: {}",
                            e, raw_json_text
                        );
                        None
                    }
                }
            }
            Err(e) => {
                warn!("HTTP request to Gemini API failed: {}. Falling back to heuristics.", e);
                None
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ai_analyzer_unconfigured() {
        let analyzer = AiAnalyzer::new(None);
        assert!(!analyzer.is_configured());
    }

    #[test]
    fn test_ai_output_deserialization_and_normalization() {
        let sample_json = r#"{
            "risk_score": 85,
            "risk_level": "high",
            "ai_analysis": "The message attempts social engineering via unauthorized OTP harvesting.",
            "findings": [
                {
                    "rule_code": "AI_OTP_HARVESTING",
                    "category": "credential_theft",
                    "description": "Suspected extraction of authentication codes",
                    "severity": "critical",
                    "score_contribution": 45,
                    "evidence": "send me the otp"
                }
            ],
            "recommendations": [
                "Never share OTPs with third parties."
            ]
        }"#;

        let parsed: AiAnalysisJson = serde_json::from_str(sample_json).expect("JSON must parse");
        assert_eq!(parsed.risk_score, 85);
        assert_eq!(parsed.findings.len(), 1);
        assert_eq!(parsed.findings[0].severity, "critical");
    }
}
