import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileSearch,
  MessageSquare,
  Globe,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react'
import { useDashboardStats, useRecentScans, useRiskDistribution } from '../hooks/useDashboard.js'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import RiskChart from '../components/dashboard/RiskChart.jsx'
import RecentScans from '../components/dashboard/RecentScans.jsx'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'

function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: recentScans, isLoading: scansLoading, error: scansError } = useRecentScans(8)
  const { data: riskDistribution, isLoading: distLoading, error: distError } = useRiskDistribution()

  const hasError = statsError || scansError || distError

  return (
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Security Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            Real-time fraud detection metrics, recent activities, and threat intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/scanner/message">
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Scan Message
            </Button>
          </Link>
          <Link to="/scanner/url">
            <Button size="sm" variant="outline" className="gap-2">
              <Globe className="h-4 w-4" /> Scan URL
            </Button>
          </Link>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load some dashboard metrics. Please check your network or backend server connection.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileSearch}
          label="Total Scans"
          value={stats?.total_scans ?? 0}
          sub="All historical scans"
          loading={statsLoading}
        />
        <StatsCard
          icon={ShieldAlert}
          label="Threats Detected"
          value={stats?.threats_detected ?? stats?.high_risk_scans ?? 0}
          sub="High & critical risk items"
          iconBg="bg-red-500/10 border-red-500/20"
          iconColor="text-red-400"
          loading={statsLoading}
        />
        <StatsCard
          icon={ShieldCheck}
          label="Clean Verified"
          value={stats?.clean_scans ?? stats?.low_risk_scans ?? 0}
          sub="Low risk / safe messages"
          iconBg="bg-green-500/10 border-green-500/20"
          iconColor="text-green-400"
          loading={statsLoading}
        />
        <StatsCard
          icon={Activity}
          label="Average Risk"
          value={stats?.avg_risk_score !== undefined ? `${Math.round(stats.avg_risk_score)}%` : '0%'}
          sub="Overall exposure score"
          iconBg="bg-yellow-500/10 border-yellow-500/20"
          iconColor="text-yellow-400"
          loading={statsLoading}
        />
      </div>

      {/* Charts & Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distLoading ? (
              <div className="h-52 flex items-center justify-center">
                <span className="text-white/40 text-sm">Loading distribution...</span>
              </div>
            ) : (
              <RiskChart data={riskDistribution || []} />
            )}
          </CardContent>
        </Card>

        {/* Recent Scans Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link
              to="/history"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="h-52 flex items-center justify-center">
                <span className="text-white/40 text-sm">Loading activity...</span>
              </div>
            ) : (
              <RecentScans scans={recentScans || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
