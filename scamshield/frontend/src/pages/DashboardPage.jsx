import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileSearch,
  MessageSquare,
  Globe,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react'
import { useDashboardStats, useRecentScans, useRiskDistribution } from '../hooks/useDashboard.js'
import StatsCard from '../components/dashboard/StatsCard.jsx'
import RiskChart from '../components/dashboard/RiskChart.jsx'
import RecentScans from '../components/dashboard/RecentScans.jsx'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'

function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: recentScans, isLoading: scansLoading, error: scansError } = useRecentScans(8)
  const { data: riskDistribution, isLoading: distLoading, error: distError } = useRiskDistribution()

  const hasError = statsError || scansError || distError

  return (
    <div className="space-y-7">
      {/* 1. Welcome Section (Prompt Section 4 Requirement) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-[#E8EFF6] shadow-[0_2px_12px_rgba(23,43,77,0.04)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Real-time Protection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
            Your Security Overview
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-xl">
            Monitor suspicious activity and protect yourself from online scams, phishing attempts, and fraud.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/scanner/url">
            <Button variant="outline" className="gap-2">
              <Globe className="h-4 w-4 text-[#64748B]" />
              <span>Scan URL</span>
            </Button>
          </Link>
          <Link to="/scanner/message">
            <Button className="gap-2 shadow-sm font-semibold">
              <MessageSquare className="h-4 w-4" />
              <span>Scan a Message</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load some dashboard metrics. Please check that the backend server is running.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* 2. Statistics Cards Grid (Image 1 & 3 style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          icon={FileSearch}
          label="Total Scans"
          value={stats?.total_scans?.toLocaleString()}
          badgeText="All Time"
          badgeColor="bg-slate-100 text-[#475569] border-slate-200"
          loading={statsLoading}
        />
        <StatsCard
          icon={ShieldAlert}
          label="High-Risk Scans"
          value={stats?.high_risk_scans?.toLocaleString()}
          badgeText="Threats"
          badgeColor="bg-rose-50 text-rose-700 border-rose-200"
          loading={statsLoading}
        />
        <StatsCard
          icon={ShieldCheck}
          label="Safe-Looking Scans"
          value={stats?.low_risk_scans?.toLocaleString()}
          badgeText="Verified"
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          loading={statsLoading}
        />
        <StatsCard
          icon={Activity}
          label="Recent Activity"
          value={stats?.scans_today != null ? `${stats.scans_today} today` : stats?.moderate_risk_scans?.toLocaleString()}
          badgeText="Active"
          badgeColor="bg-blue-50 text-blue-700 border-blue-200"
          loading={statsLoading}
        />
      </div>

      {/* 3. Middle Section: Risk Distribution & Quick Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Risk Distribution Chart (Image 1 & 3 style) */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border-[#E8EFF6] bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Breakdown of all scanned inputs by heuristic severity</CardDescription>
                </div>
                <div className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E8EFF6] px-2.5 py-1 rounded-lg">
                  Live Telemetry
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {distLoading ? (
                <div className="h-60 flex items-center justify-center text-xs text-[#94A3B8]">
                  Loading distribution...
                </div>
              ) : (
                <RiskChart data={riskDistribution || []} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Recommendation Panel */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl border-[#E8EFF6] bg-white h-full">
            <CardHeader className="pb-3">
              <CardTitle>Security Quick Tips</CardTitle>
              <CardDescription>Best practices for digital communication hygiene</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6]">
                <p className="font-semibold text-[#172B4D] mb-1">Never Share OTPs Over Text</p>
                <p className="text-[#64748B] leading-relaxed">
                  Banks, courier services, and telecom companies will never request your one-time passwords via SMS or WhatsApp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6]">
                <p className="font-semibold text-[#172B4D] mb-1">Beware of Urgency Triggers</p>
                <p className="text-[#64748B] leading-relaxed">
                  Scammers simulate urgency like "Account blocked today" to induce panic before you have time to verify through official channels.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6]">
                <p className="font-semibold text-[#172B4D] mb-1">Inspect Shortened URLs</p>
                <p className="text-[#64748B] leading-relaxed">
                  Links using bit.ly, tinyurl, or suspicious TLDs (.tk, .xyz) often conceal phishing landing pages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Recent Scans Table (Image 3 style) */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white">
        <CardHeader className="border-b border-[#E8EFF6] pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Recent Scan Activity</CardTitle>
              <CardDescription>Audit history of recent messages and URLs analyzed</CardDescription>
            </div>
            <Link to="/history">
              <Button variant="outline" size="sm" className="text-xs">
                View Complete History
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RecentScans scans={recentScans || []} />
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
