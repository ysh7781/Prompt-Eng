import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import RiskBadge from '../scanner/RiskBadge.jsx'
import { MessageSquare, Link as LinkIcon, ExternalLink } from 'lucide-react'

function RecentScans({ scans = [] }) {
  if (scans.length === 0) {
    return (
      <div className="py-10 text-center text-white/30 text-sm">
        No recent scans. <Link to="/scanner/message" className="text-blue-400 hover:underline">Start scanning</Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="pb-3 text-left text-xs uppercase tracking-wider text-white/40 font-medium">Type</th>
            <th className="pb-3 text-left text-xs uppercase tracking-wider text-white/40 font-medium">Content</th>
            <th className="pb-3 text-left text-xs uppercase tracking-wider text-white/40 font-medium">Risk</th>
            <th className="pb-3 text-left text-xs uppercase tracking-wider text-white/40 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {scans.map((scan) => (
            <tr key={scan.id} className="hover:bg-white/2 transition-colors">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-1.5 text-white/50">
                  {scan.input_type === 'url'
                    ? <LinkIcon className="h-3.5 w-3.5" />
                    : <MessageSquare className="h-3.5 w-3.5" />
                  }
                  <span className="capitalize text-xs">{scan.input_type}</span>
                </div>
              </td>
              <td className="py-3 pr-4 max-w-xs">
                <p className="text-white/70 truncate text-xs">
                  {scan.input_content || <span className="text-white/30 italic">Content not saved</span>}
                </p>
              </td>
              <td className="py-3 pr-4">
                <RiskBadge level={scan.risk_level} />
              </td>
              <td className="py-3 text-white/40 text-xs whitespace-nowrap">
                {scan.analyzed_at ? format(new Date(scan.analyzed_at), 'MMM d, HH:mm') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentScans

