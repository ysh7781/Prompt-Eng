import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ShieldAlert,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Database,
  Sliders,
  ShieldCheck,
} from 'lucide-react'
import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
  getAdminStats,
} from '../services/adminApi.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Label } from '../components/ui/Label.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog.jsx'

function AdminPage() {
  const queryClient = useQueryClient()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState(null)
  const [editWeight, setEditWeight] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    rule_code: '',
    category: 'urgency',
    name: '',
    description: '',
    weight: 20,
    severity: 'medium',
    pattern: '',
    is_active: true,
  })

  // Queries
  const { data: rulesData, isLoading: rulesLoading, error: rulesError } = useQuery({
    queryKey: ['admin', 'rules'],
    queryFn: () => getRules().then((res) => res.data),
  })

  const { data: adminStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats().then((res) => res.data).catch(() => null),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rules'] })
      setShowAddModal(false)
      setNewRule({
        rule_code: '',
        category: 'urgency',
        name: '',
        description: '',
        weight: 20,
        severity: 'medium',
        pattern: '',
        is_active: true,
      })
    },
    onError: (err) => {
      setErrorMessage(err.response?.data?.message || 'Failed to create detection rule.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rules'] })
      setEditingRuleId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rules'] })
      setDeleteConfirmId(null)
    },
  })

  const rules = Array.isArray(rulesData) ? rulesData : rulesData?.rules || []

  const handleToggleActive = (rule) => {
    updateMutation.mutate({
      id: rule.id,
      data: { is_active: !rule.is_active },
    })
  }

  const handleSaveWeight = (id) => {
    const num = parseInt(editWeight, 10)
    if (!isNaN(num) && num >= 0 && num <= 100) {
      updateMutation.mutate({
        id,
        data: { weight: num },
      })
    }
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)
    createMutation.mutate({
      ...newRule,
      weight: parseInt(newRule.weight, 10) || 10,
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
            Detection Engine Administration
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure cybersecurity heuristic rules, score weights, and threat thresholds.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" /> Add Detection Rule
        </Button>
      </div>

      {rulesError && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Failed to fetch detection rules. Admin privileges required.</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Metric Cards (WunderUI style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-[#E8EFF6] bg-white p-6 shadow-[0_4px_20px_rgba(23,43,77,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Configured Rules</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#172B4D] tracking-tight">{rules.length}</p>
          <span className="text-xs text-[#64748B] mt-1.5 block">Active heuristic definitions</span>
        </div>

        <div className="rounded-2xl border border-[#E8EFF6] bg-white p-6 shadow-[0_4px_20px_rgba(23,43,77,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Total Users</span>
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#172B4D] tracking-tight">{adminStats?.total_users ?? '—'}</p>
          <span className="text-xs text-[#64748B] mt-1.5 block">Registered tenant identities</span>
        </div>

        <div className="rounded-2xl border border-[#E8EFF6] bg-white p-6 shadow-[0_4px_20px_rgba(23,43,77,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">System Scans Executed</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#172B4D] tracking-tight">{adminStats?.total_scans ?? '—'}</p>
          <span className="text-xs text-[#64748B] mt-1.5 block">Platform-wide evaluations</span>
        </div>
      </div>

      {/* Rules Registry Card */}
      <div className="rounded-3xl border border-[#E8EFF6] bg-white shadow-[0_4px_24px_rgba(23,43,77,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E8EFF6] flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#2563EB]" /> Heuristic Rules Registry
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live rules evaluated during message and URL analysis. Toggle to disable or adjust weight penalty.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#64748B] px-3 py-1 rounded-full bg-[#F4F8FD] border border-[#E8EFF6]">
            {rules.length} Active Rules
          </span>
        </div>

        <div className="p-0">
          {rulesLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <Spinner size="lg" />
              <p className="text-sm text-[#64748B]">Loading rules table...</p>
            </div>
          ) : rules.length === 0 ? (
            <div className="py-16 text-center text-[#64748B] text-sm">
              No detection rules configured. Click &quot;Add Detection Rule&quot; to seed rules.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8EFF6] bg-[#F8FAFC] text-[#64748B] text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Code & Name</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Severity</th>
                    <th className="py-3 px-6 text-left">Weight (Score)</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EFF6]">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(rule)}
                          className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                        >
                          {rule.is_active ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <ToggleRight className="h-5 w-5 text-emerald-600" /> Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#94A3B8]">
                              <ToggleLeft className="h-5 w-5 text-[#CBD5E1]" /> Disabled
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-6">
                        <div>
                          <span className="font-mono text-xs font-semibold text-[#2563EB]">
                            {rule.rule_code}
                          </span>
                          <p className="text-[#172B4D] text-xs font-medium mt-0.5">{rule.name || rule.description}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="text-xs text-[#64748B] capitalize font-medium">{rule.category}</span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <Badge
                          variant={
                            rule.severity === 'critical' ? 'critical' :
                            rule.severity === 'high' ? 'high' :
                            rule.severity === 'medium' ? 'moderate' : 'low'
                          }
                        >
                          {rule.severity}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {editingRuleId === rule.id ? (
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              value={editWeight}
                              onChange={(e) => setEditWeight(e.target.value)}
                              className="h-8 w-16 text-xs p-1 text-center font-bold"
                              min="0"
                              max="100"
                            />
                            <Button
                              size="sm"
                              className="h-8 px-2.5"
                              onClick={() => handleSaveWeight(rule.id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2"
                              onClick={() => setEditingRuleId(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#172B4D]">+{rule.weight}</span>
                            <button
                              onClick={() => {
                                setEditingRuleId(rule.id)
                                setEditWeight(rule.weight.toString())
                              }}
                              className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-1"
                              title="Edit weight"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteConfirmId(rule.id)}
                          title="Delete rule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Rule Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg bg-white border border-[#E8EFF6] shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#172B4D]">Create Heuristic Rule</DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              Define a pattern match or behavioral trigger for the scanner engine.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="rule_code" className="text-xs font-bold text-[#172B4D]">Rule Code</Label>
                <Input
                  id="rule_code"
                  placeholder="MSG_URGENCY_01"
                  value={newRule.rule_code}
                  onChange={(e) => setNewRule({ ...newRule, rule_code: e.target.value })}
                  required
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category" className="text-xs font-bold text-[#172B4D]">Category</Label>
                <select
                  id="category"
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="w-full h-10 rounded-xl border border-[#E8EFF6] bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="urgency">Urgency & Pressure</option>
                  <option value="financial">Financial Scam</option>
                  <option value="phishing">Phishing Link</option>
                  <option value="impersonation">Impersonation</option>
                  <option value="domain">Domain Anomaly</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="rule_name" className="text-xs font-bold text-[#172B4D]">Rule Name</Label>
              <Input
                id="rule_name"
                placeholder="Urgent Account Suspension Threat"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rule_desc" className="text-xs font-bold text-[#172B4D]">Description</Label>
              <Input
                id="rule_desc"
                placeholder="Triggers when content demands immediate action within 24 hours"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="weight" className="text-xs font-bold text-[#172B4D]">Risk Weight (0-100)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="100"
                  value={newRule.weight}
                  onChange={(e) => setNewRule({ ...newRule, weight: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="severity" className="text-xs font-bold text-[#172B4D]">Severity</Label>
                <select
                  id="severity"
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                  className="w-full h-10 rounded-xl border border-[#E8EFF6] bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pattern" className="text-xs font-bold text-[#172B4D]">Pattern Regex / Keywords (Optional)</Label>
              <Input
                id="pattern"
                placeholder="(?i)(account.*(suspended|locked|terminated))"
                value={newRule.pattern}
                onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EFF6]">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending} className="font-semibold">
                {createMutation.isPending ? 'Saving Rule...' : 'Save Rule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md bg-white border border-[#E8EFF6] shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2 text-lg font-bold">
              <AlertTriangle className="h-5 w-5" /> Delete Heuristic Rule
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B] mt-2">
              Are you sure you want to delete this detection rule? Future scans will no longer evaluate this condition.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6 border-t border-[#E8EFF6] pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteConfirmId)}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPage
