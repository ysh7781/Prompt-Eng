import React from 'react'
import { CheckCircle, AlertTriangle, Shield, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx'
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
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Header summary */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                risk_level === 'low' ? 'bg-green-500/10' :
                risk_level === 'moderate' ? 'bg-yellow-500/10' :
                risk_level === 'high' ? 'bg-orange-500/10' :
                'bg-red-500/10'
              }`}>
                {risk_level === 'low'
                  ? <CheckCircle className="h-5 w-5 text-green-400" />
                  : <AlertTriangle className="h-5 w-5 text-orange-400" />
                }
              </div>
              <div>
                <CardTitle>Analysis Complete</CardTitle>
                <p className="text-sm text-white/50 mt-1">
                  {input_type === 'url' ? 'URL' : 'Message'} scan • {analyzed_at ? format(new Date(analyzed_at), 'MMM d, yyyy HH:mm') : 'Just now'}
                </p>
              </div>
            </div>
            <RiskBadge level={risk_level} />
          </div>
        </CardHeader>
        <CardContent>
          <RiskMeter score={risk_score} level={risk_level} />
        </CardContent>
      </Card>

      {/* Findings */}
      {hasFindings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Detections ({findings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {findings.map((finding, idx) => (
              <FindingCard key={finding.id || idx} finding={finding} />
            ))}
          </CardContent>
        </Card>
      )}

      {!hasFindings && (
        <Card>
          <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-green-500/10 border border-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-white/70 font-medium">No threats detected</p>
            <p className="text-white/40 text-sm">This content appears to be safe.</p>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  {rec}
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

