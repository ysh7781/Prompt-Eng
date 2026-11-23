use uuid::Uuid;

use crate::{
    detection::Analyzer,
    dto::scanner_dto::{
        FindingResponse, InputType, PaginationParams, ScanHistoryResponse, ScanRequest,
        ScanResponse,
    },
    error::AppResult,
    repositories::ScanRepository,
};

pub struct ScannerService {
    scan_repo: ScanRepository,
    analyzer: Analyzer,
}

impl ScannerService {
    pub fn new(scan_repo: ScanRepository, gemini_api_key: Option<String>) -> Self {
        Self {
            scan_repo,
            analyzer: Analyzer::with_gemini_key(gemini_api_key),
        }
    }

    pub async fn analyze(&self, user_id: Uuid, req: ScanRequest) -> AppResult<ScanResponse> {
        // Run hybrid AI + heuristic analysis
        let result = match req.input_type {
            InputType::Message => self.analyzer.analyze_message_hybrid(&req.input).await,
            InputType::Url => self.analyzer.analyze_url_hybrid(&req.input).await,
        };

        let input_content = if req.save_content.unwrap_or(true) {
            Some(req.input.as_str())
        } else {
            None
        };

        // Persist scan
        let scan = self
            .scan_repo
            .create_scan(
                user_id,
                req.input_type.as_str(),
                input_content,
                result.score,
                &result.risk_level,
            )
            .await?;

        // Persist findings
        for finding in &result.findings {
            self.scan_repo
                .create_finding(
                    scan.id,
                    &finding.rule_code,
                    &finding.category,
                    &finding.description,
                    &finding.severity,
                    finding.score_contribution,
                    finding.evidence.as_deref(),
                )
                .await?;
        }

        let finding_responses: Vec<FindingResponse> = result
            .findings
            .into_iter()
            .map(|f| FindingResponse {
                rule_code: f.rule_code,
                category: f.category,
                description: f.description,
                severity: f.severity,
                score_contribution: f.score_contribution,
                evidence: f.evidence,
            })
            .collect();

        Ok(ScanResponse {
            id: scan.id,
            input_type: scan.input_type,
            risk_score: result.score,
            risk_level: result.risk_level,
            findings: finding_responses,
            recommendations: result.recommendations,
            analyzed_at: scan.analyzed_at,
            ai_analysis: result.ai_analysis,
            is_ai_powered: result.is_ai_powered,
        })
    }

    pub async fn get_history(
        &self,
        user_id: Uuid,
        params: PaginationParams,
    ) -> AppResult<ScanHistoryResponse> {
        let page = params.page.unwrap_or(1).max(1);
        let page_size = params.page_size.unwrap_or(20).min(100).max(1);

        let items = self.scan_repo.list_user_scans(user_id, page, page_size).await?;
        let total = self.scan_repo.count_user_scans(user_id).await?;

        Ok(ScanHistoryResponse {
            items,
            total,
            page,
            page_size,
        })
    }

    pub async fn get_scan_detail(&self, user_id: Uuid, scan_id: Uuid) -> AppResult<ScanResponse> {
        let scan = self
            .scan_repo
            .get_scan_by_id(scan_id, user_id)
            .await?
            .ok_or_else(|| crate::error::AppError::NotFound("Scan not found".to_string()))?;

        let findings = self.scan_repo.get_findings_for_scan(scan_id).await?;
        let finding_responses: Vec<FindingResponse> = findings
            .into_iter()
            .map(|f| FindingResponse {
                rule_code: f.rule_code,
                category: f.category,
                description: f.description,
                severity: f.severity,
                score_contribution: f.score_contribution,
                evidence: f.evidence,
            })
            .collect();

        let raw_findings: Vec<crate::detection::scoring::Finding> = finding_responses
            .iter()
            .map(|f| crate::detection::scoring::Finding {
                rule_code: f.rule_code.clone(),
                category: f.category.clone(),
                description: f.description.clone(),
                severity: f.severity.clone(),
                score_contribution: f.score_contribution,
                evidence: f.evidence.clone(),
            })
            .collect();

        let recommendations = crate::detection::scoring::generate_recommendations(&raw_findings, &scan.risk_level);

        Ok(ScanResponse {
            id: scan.id,
            input_type: scan.input_type,
            risk_score: scan.risk_score,
            risk_level: scan.risk_level,
            findings: finding_responses,
            recommendations,
            analyzed_at: scan.analyzed_at,
            ai_analysis: None,
            is_ai_powered: false,
        })
    }

    pub async fn delete_scan(&self, user_id: Uuid, scan_id: Uuid) -> AppResult<bool> {
        self.scan_repo.delete_scan(scan_id, user_id).await
    }
}
