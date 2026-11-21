import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  MessageSquare,
  Globe,
  Zap,
  Lock,
  EyeOff,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { Button } from '../components/ui/Button.jsx'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-24 py-12 relative overflow-hidden bg-ambient-gradient">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-white/90 text-[#2563EB] text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Threat & Fraud Prevention
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#172B4D] tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Protect Yourself from <span className="text-[#2563EB]">Digital Scams</span> and Phishing Fraud
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Instantly detect malicious SMS messages, suspicious WhatsApp notifications, phishing URLs, and credential harvesting attempts with explainable heuristic risk scoring.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto font-semibold shadow-md" onClick={() => navigate('/register')}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold" onClick={() => navigate('/login')}>
            Sign In to Dashboard
          </Button>
        </div>
      </section>

      {/* Visual Demo Cards (Image 2 style) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo Message Scanner */}
          <div className="rounded-3xl border border-[#E8EFF6] bg-white p-7 shadow-[0_4px_24px_rgba(23,43,77,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#172B4D] font-bold text-sm">
                  <div className="h-8 w-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span>Message Threat Analyzer</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  Critical Risk 100/100
                </span>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 text-xs font-mono text-[#172B4D] mb-4">
                "URGENT: Your bank account will be blocked today. Verify your account immediately by entering OTP at http://192.168.1.1/verify"
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-700 font-medium">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Flagged: Urgent account-blocking threat (Urgency heuristic)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700 font-medium">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Flagged: Direct OTP credential request (Credential theft)</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700 font-medium">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>Flagged: Suspicious IP address hostname in URL</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E8EFF6] mt-6 flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Deterministic multi-tier rules</span>
              <Button size="sm" onClick={() => navigate('/scanner/message')}>
                Try Scanner <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Demo URL Scanner */}
          <div className="rounded-3xl border border-[#E8EFF6] bg-white p-7 shadow-[0_4px_24px_rgba(23,43,77,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#172B4D] font-bold text-sm">
                  <div className="h-8 w-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span>URL Security Inspector</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                  Moderate Risk 45/100
                </span>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-xs font-mono text-[#172B4D] mb-4">
                "http://paypal-security-update.com.tk/login"
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Flagged: Suspicious TLD (.tk free domain registration)</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Flagged: Misleading domain structure (Paypal spoofing)</span>
                </div>
                <div className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Flagged: Insecure HTTP protocol without TLS</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#E8EFF6] mt-6 flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Zero-execution analysis</span>
              <Button size="sm" onClick={() => navigate('/scanner/url')}>
                Try Scanner <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-[#172B4D] tracking-tight">
            Security Intelligence You Can Trust
          </h2>
          <p className="mt-3 text-sm text-[#64748B]">
            Engineered with deep protocol inspection and explainable risk evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Explainable Risk Scoring',
              desc: 'Never receive a vague safe/unsafe badge. See exactly which security rules triggered and why each phrase is dangerous.',
            },
            {
              icon: Shield,
              title: 'Contextual Impersonation Checks',
              desc: 'Avoid false positives. Financial and delivery keywords are contextually matched with urgency to eliminate spam noise.',
            },
            {
              icon: Globe,
              title: 'URL Heuristics Analyzer',
              desc: 'Deep inspection for Punycode homograph attacks, suspicious TLDs, IP hosts, and misleading brand patterns.',
            },
            {
              icon: Lock,
              title: 'Safe Sandboxed Architecture',
              desc: 'ScamShield never visits or executes untrusted links on the backend, safeguarding you from drive-by downloads.',
            },
            {
              icon: EyeOff,
              title: 'Strict Data Privacy',
              desc: 'Zero storage of OTPs or passwords. You maintain full control over whether your scan history is retained.',
            },
            {
              icon: MessageSquare,
              title: 'Cross-Platform Support',
              desc: 'Analyze SMS messages, WhatsApp alerts, banking emails, Telegram texts, and courier verification requests.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8EFF6] bg-white p-6 shadow-sm hover:shadow-[0_4px_16px_rgba(23,43,77,0.06)] transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-[#2563EB] mb-4">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D] tracking-tight mb-2">{item.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Process */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-[#E8EFF6] bg-white p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
              How ScamShield Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
              Three simple steps to verify digital communications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#F4F8FD] border border-[#E8EFF6] flex items-center justify-center text-sm font-extrabold text-[#2563EB] mx-auto">
                01
              </div>
              <h4 className="text-sm font-bold text-[#172B4D]">Submit Suspicious Text</h4>
              <p className="text-xs text-[#64748B]">
                Paste any text message, WhatsApp notice, or link received on your devices.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#F4F8FD] border border-[#E8EFF6] flex items-center justify-center text-sm font-extrabold text-[#2563EB] mx-auto">
                02
              </div>
              <h4 className="text-sm font-bold text-[#172B4D]">Heuristic Threat Engine</h4>
              <p className="text-xs text-[#64748B]">
                15+ security rules simultaneously evaluate urgency, credential requests, and spoofing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-[#F4F8FD] border border-[#E8EFF6] flex items-center justify-center text-sm font-extrabold text-[#2563EB] mx-auto">
                03
              </div>
              <h4 className="text-sm font-bold text-[#172B4D]">Explainable Action Report</h4>
              <p className="text-xs text-[#64748B]">
                Receive instant risk classification with safety recommendations to protect your assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-[#0F1E36] to-[#172B4D] text-white shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Start Scanning with Confidence
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-lg mx-auto">
            Create your account today and gain access to comprehensive fraud detection telemetry.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="font-semibold shadow-md" onClick={() => navigate('/register')}>
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
