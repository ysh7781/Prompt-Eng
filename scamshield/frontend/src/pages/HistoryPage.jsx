import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import {
  History as HistoryIcon,
  MessageSquare,
  Globe,
  Trash2,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react'
import { useHistory, useDeleteScan, useScanDetail } from '../hooks/useHistory.js'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import RiskBadge from '../components/scanner/RiskBadge.jsx'
import ScanResult from '../components/scanner/ScanResult.jsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'

function HistoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [selectedScanId, setSelectedScanId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const { data, isLoading, error } = useHistory({ page, limit })
  const { data: detailData, isLoading: detailLoading } = useScanDetail(selectedScanId)
  const deleteMutation = useDeleteScan()

  const rawItems = data?.items || data?.scans || (Array.isArray(data) ? data : [])
  const totalItems = data?.total || rawItems.length

  // Client filter for search and type/risk filter
  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      const matchesSearch = searchTerm
        ? (item.input_content || '').toLowerCase().includes(searchTerm.toLowerCase())
        : true
      const matchesType = selectedType === 'all' ? true : item.input_type === selectedType
      const matchesRisk = selectedRisk === 'all' ? true : item.risk_level === selectedRisk
      return matchesSearch && matchesType && matchesRisk
    })
  }, [rawItems, searchTerm, selectedType, selectedRisk])

  const totalPages = Math.max(1, Math.ceil(totalItems / limit))

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirmId(null)
    } catch (err) {
      // error handled
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">Scan History</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Searchable audit trail of all verified SMS, messages, and suspicious URLs.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to load scan history records.</AlertDescription>
        </Alert>
      )}

      {/* Filter and Search Bar (Image 3 style) */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search content or URLs..."
              className="w-full h-10 rounded-xl border border-[#E2EAF2] bg-[#F8FAFC] pl-10 pr-4 text-xs text-[#172B4D] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6] text-xs">
              <span className="text-[#64748B] px-2 font-medium">Type:</span>
              {['all', 'message', 'url'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedType === type
                      ? 'bg-white shadow-sm text-[#172B4D] border border-[#E8EFF6]'
                      : 'text-[#64748B] hover:text-[#172B4D]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6] text-xs">
              <span className="text-[#64748B] px-2 font-medium">Risk:</span>
              {['all', 'critical', 'high', 'moderate', 'low'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedRisk === risk
                      ? 'bg-white shadow-sm text-[#172B4D] border border-[#E8EFF6]'
                      : 'text-[#64748B] hover:text-[#172B4D]'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Table Card (Image 3 style) */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#E8EFF6] text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold bg-[#F8FAFC]">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Input Preview</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Findings</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EFF6]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#94A3B8]">
                    <p className="font-medium text-[#64748B]">No matching scan records found</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Try resetting your filters or submit a new message/URL to scan.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((scan) => (
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
                        <span className="capitalize text-xs font-semibold text-[#172B4D]">{scan.input_type}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <p className="text-xs font-mono text-[#172B4D] truncate">
                        {scan.input_content || <span className="text-[#94A3B8] italic font-sans">Content not saved</span>}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={scan.risk_level} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-[#172B4D] font-mono">{scan.risk_score}/100</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-[#64748B] font-medium">{scan.finding_count || 0} rule triggers</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#64748B] whitespace-nowrap">
                      {scan.analyzed_at ? format(new Date(scan.analyzed_at), 'MMM d, yyyy · HH:mm') : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedScanId(scan.id)}
                          className="h-8 px-2.5 text-xs text-[#172B4D]"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                          Report
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(scan.id)}
                          className="h-8 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-[#E8EFF6] flex items-center justify-between text-xs text-[#64748B] bg-[#F8FAFC]">
          <span>
            Showing page {page} of {totalPages} ({totalItems} total scans)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Detailed Report Modal */}
      <Dialog open={!!selectedScanId} onOpenChange={(open) => !open && setSelectedScanId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historical Scan Report</DialogTitle>
            <DialogDescription>Full assessment details and rule trigger breakdown</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-12 flex items-center justify-center">
              <Spinner size="md" />
            </div>
          ) : detailData?.data ? (
            <ScanResult result={detailData.data} />
          ) : (
            <p className="text-xs text-[#64748B] py-6 text-center">Unable to load scan details.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Scan Record?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This record and its associated detection findings will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => handleDelete(deleteConfirmId)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HistoryPage
