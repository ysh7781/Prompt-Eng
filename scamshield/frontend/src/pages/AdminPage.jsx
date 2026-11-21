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
  Sliders
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

  const { data: adminStats, isLoading: statsLoading } = useQuery({
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Detection Engine Administration</h1>
          <p className="text-white/50 text-sm mt-1">
            Configure cybersecurity heuristic rules, score weights, and threat thresholds.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-2">
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

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <Database className="h-4 w-4 text-purple-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Configured Rules</span>
          </div>
          <p className="text-2xl font-bold text-white">{rules.length}</p>
          <span className="text-xs text-white/40 mt-1 block">Active heuristic definitions</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Total Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{adminStats?.total_users ?? '—'}</p>
          <span className="text-xs text-white/40 mt-1 block">Registered tenant identities</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5">
          <div className="flex items-center gap-3 text-white/50 mb-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">System Scans Executed</span>
          </div>
          <p className="text-2xl font-bold text-white">{adminStats?.total_scans ?? '—'}</p>
          <span className="text-xs text-white/40 mt-1 block">Platform-wide evaluations</span>
        </div>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-400" /> Heuristic Rules Registry
          </CardTitle>
          <CardDescription>
            Live rules evaluated during message and URL analysis. Toggle to disable or adjust weight penalty.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rulesLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2">
              <Spinner size="lg" />
              <p className="text-sm text-white/40">Loading rules table...</p>
            </div>
          ) : rules.length === 0 ? (
            <div className="py-16 text-center text-white/40 text-sm">
              No detection rules configured. Click &quot;Add Detection Rule&quot; to seed rules.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-left font-medium">Code & Name</th>
                    <th className="pb-3 text-left font-medium">Category</th>
                    <th className="pb-3 text-left font-medium">Severity</th>
                    <th className="pb-3 text-left font-medium">Weight (Score)</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(rule)}
                          className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                        >
                          {rule.is_active ? (
                            <span className="inline-flex items-center gap-1 text-green-400">
                              <ToggleRight className="h-5 w-5" /> Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-white/40">
                              <ToggleLeft className="h-5 w-5" /> Disabled
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div>
                          <span className="font-mono text-xs font-semibold text-blue-400">
                            {rule.rule_code}
                          </span>
                          <p className="text-white text-xs font-medium">{rule.name || rule.description}</p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <span className="text-xs text-white/60 capitalize">{rule.category}</span>
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
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
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        {editingRuleId === rule.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={editWeight}
                              onChange={(e) => setEditWeight(e.target.value)}
                              className="h-7 w-16 text-xs p-1"
                              min="0"
                              max="100"
                            />
                            <Button
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => handleSaveWeight(rule.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() => setEditingRuleId(null)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white/80">+{rule.weight}</span>
                            <button
                              onClick={() => {
                                setEditingRuleId(rule.id)
                                setEditWeight(rule.weight.toString())
                              }}
                              className="text-white/30 hover:text-white"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteConfirmId(rule.id)}
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
        </CardContent>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Heuristic Rule</DialogTitle>
            <DialogDescription>
              Define a pattern match or behavioral trigger for the scanner engine.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="rule_code">Rule Code</Label>
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
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="urgency" className="bg-[#0a1628]">Urgency & Pressure</option>
                  <option value="financial" className="bg-[#0a1628]">Financial Scam</option>
                  <option value="phishing" className="bg-[#0a1628]">Phishing Link</option>
                  <option value="impersonation" className="bg-[#0a1628]">Impersonation</option>
                  <option value="domain" className="bg-[#0a1628]">Domain Anomaly</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="rule_name">Rule Name</Label>
              <Input
                id="rule_name"
                placeholder="Urgent Account Suspension Threat"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rule_desc">Description</Label>
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
                <Label htmlFor="weight">Risk Weight (0-100)</Label>
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
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  value={newRule.severity}
                  onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                  className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low" className="bg-[#0a1628]">Low</option>
                  <option value="medium" className="bg-[#0a1628]">Medium</option>
                  <option value="high" className="bg-[#0a1628]">High</option>
                  <option value="critical" className="bg-[#0a1628]">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="pattern">Pattern Regex / Keywords (Optional)</Label>
              <Input
                id="pattern"
                placeholder="(?i)(account.*(suspended|locked|terminated))"
                value={newRule.pattern}
                onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving Rule...' : 'Save Rule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Delete Heuristic Rule
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this detection rule? Future scans will no longer evaluate this condition.
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
