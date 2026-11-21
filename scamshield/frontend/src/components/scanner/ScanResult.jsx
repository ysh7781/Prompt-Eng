import React from 'react'
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, ShieldAlert, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card.jsx'
import RiskBadge from './RiskBadge.jsx'
import RiskMeter from './RiskMeter.jsx'
import FindingCard from './FindingCard.jsx'
import { format } from 'date-fns'

function ScanResult({ result }) {
  if (!result) return null

  const {
    id,
    input_type,
    risk_score,
    risk_level,
    findings = [],
    recommendations = [],
    analyzed_at,
  } = result

  const hasFindings = findings.length > 0

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-300">
      {/* 1. Header Summary Card */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-[0_2px_12px_rgba(23,43,77,0.04)]">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  risk_level === 'low'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : risk_level === 'moderate'
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-rose-50 border-rose-200 text-rose-600'
                }`}
              >
                {risk_level === 'low' ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <ShieldAlert className="h-6 w-6" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Analysis Complete</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {input_type === 'url' ? 'URL Link Analysis' : 'Communication Text Analysis'} •{' '}
                  {analyzed_at ? format(new Date(analyzed_at), 'MMM d, yyyy · HH:mm') : 'Just now'}
                </CardDescription>
              </div>
            </div>
            <RiskBadge level={risk_level} />
          </div>
        </CardHeader>
        <CardContent>
          <RiskMeter score={risk_score} level={risk_level} />
        </CardContent>
      </Card>

      {/* 2. Security Findings */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-[0_2px_12px_rgba(23,43,77,0.04)]">
        <CardHeader className="border-b border-[#E8EFF6] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Triggered Security Findings ({findings.length})</CardTitle>
              <CardDescription>Explains specifically why this content was flagged</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {hasFindings ? (
            <div className="space-y-3">
              {findings.map((finding, idx) => (
                <FindingCard key={idx} finding={finding} />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-emerald-50/60 border border-emerald-200/60">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-950">No threats detected</p>
              <p className="text-xs text-emerald-800/80 mt-1 max-w-md mx-auto">
                While this message did not trigger our heuristic fraud rules, always remain vigilant before entering passwords or sharing personal details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Recommended Safety Actions */}
      {recommendations.length > 0 && (
        <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-[0_2px_12px_rgba(23,43,77,0.04)]">
          <CardHeader className="pb-3">
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>Follow these precautions to protect your account and data</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-[#172B4D]">
                  <span className="h-5 w-5 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ScanResult
