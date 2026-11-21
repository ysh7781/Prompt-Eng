import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import RiskBadge from '../scanner/RiskBadge.jsx'
import { MessageSquare, Globe, ChevronRight } from 'lucide-react'

function RecentScans({ scans = [] }) {
  if (scans.length === 0) {
    return (
      <div className="py-12 text-center text-[#94A3B8] text-sm">
        <p className="font-medium text-[#64748B]">No recent scan activity</p>
        <p className="text-xs text-[#94A3B8] mt-1 mb-4">You have not scanned any messages or URLs yet.</p>
        <Link
          to="/scanner/message"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition-colors"
        >
          Scan Message Now
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-[#E8EFF6] text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold bg-[#F8FAFC]">
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Input Preview</th>
            <th className="py-3 px-4">Risk Level</th>
            <th className="py-3 px-4">Analyzed At</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E8EFF6]">
          {scans.map((scan) => (
            <tr key={scan.id} className="hover:bg-[#F4F8FD] transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B]">
                    {scan.input_type === 'url' ? (
                      <Globe className="h-3.5 w-3.5" />
                    ) : (
                      <MessageSquare className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="capitalize text-xs font-medium text-[#172B4D]">{scan.input_type}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 max-w-sm">
                <p className="text-xs text-[#172B4D] truncate font-mono">
                  {scan.input_content || <span className="text-[#94A3B8] italic font-sans">Content not retained</span>}
                </p>
              </td>
              <td className="py-3.5 px-4">
                <RiskBadge level={scan.risk_level} />
              </td>
              <td className="py-3.5 px-4 text-[#64748B] text-xs whitespace-nowrap">
                {scan.analyzed_at ? format(new Date(scan.analyzed_at), 'MMM d, yyyy · HH:mm') : '—'}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  to="/history"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
                >
                  <span>Details</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentScans
