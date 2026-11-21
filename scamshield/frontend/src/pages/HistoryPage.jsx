import React, { useState } from 'react'
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
  CheckCircle,
  X
} from 'lucide-react'
import { useHistory, useDeleteScan, useScanDetail } from '../hooks/useHistory.js'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx'
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
  const [selectedScanId, setSelectedScanId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const { data, isLoading, error } = useHistory({ page, limit })
  const { data: detailData, isLoading: detailLoading } = useScanDetail(selectedScanId)
  const deleteMutation = useDeleteScan()

  const scans = data?.scans || data?.data || (Array.isArray(data) ? data : [])
  const total = data?.total || data?.count || scans.length
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirmId(null)
    } catch (err) {
      // error handled
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Scan History & Audits</h1>
        <p className="text-white/50 text-sm mt-1">
          Review previous message and URL scans, drill down into findings, or remove records.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Failed to fetch history logs from the server.</AlertDescription>
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <HistoryIcon className="h-4 w-4 text-blue-400" /> Recorded Scans ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <Spinner size="lg" />
              <p className="text-sm text-white/40">Loading history logs...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="py-16 text-center text-white/40 text-sm">
              No scan history found. Run a message or URL scan to populate this list.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                    <th className="pb-3 text-left font-medium">Type</th>
                    <th className="pb-3 text-left font-medium">Content Snippet</th>
                    <th className="pb-3 text-left font-medium">Risk Score</th>
                    <th className="pb-3 text-left font-medium">Verdict</th>
                    <th className="pb-3 text-left font-medium">Date Analyzed</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-white/60">
                          {scan.input_type === 'url' ? (
                            <Globe className="h-4 w-4 text-indigo-400" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                          )}
                          <span className="capitalize text-xs font-medium text-white/80">
                            {scan.input_type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 max-w-xs">
                        <span className="text-white/70 text-xs truncate block font-mono">
                          {scan.input_content || (
                            <span className="text-white/30 italic">Not recorded</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap font-mono text-xs">
                        <span className="text-white font-semibold">{scan.risk_score}</span>
                        <span className="text-white/40">/100</span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <RiskBadge level={scan.risk_level} />
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap text-xs text-white/40">
                        {scan.analyzed_at
                          ? format(new Date(scan.analyzed_at), 'yyyy-MM-dd HH:mm')
                          : '—'}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/60 hover:text-white"
                            onClick={() => setSelectedScanId(scan.id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => setDeleteConfirmId(scan.id)}
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
              <span className="text-xs text-white/40">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="gap-1"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedScanId} onOpenChange={(open) => !open && setSelectedScanId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scan Intelligence Report</DialogTitle>
            <DialogDescription>
              Detailed breakdown of rule contributions and mitigation findings.
            </DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            detailData && <ScanResult result={detailData} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently remove this scan record from your audit history? This action cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => handleDelete(deleteConfirmId)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HistoryPage
