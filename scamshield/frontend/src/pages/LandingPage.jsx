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
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { Button } from '../components/ui/Button.jsx'

function LandingPage() {
  const navigate = useNavigate()
  const [demoMessage, setDemoMessage] = useState('URGENT: Your bank account has been locked. Verify immediately at http://secure-bank-login-update.net/auth')
  const [demoUrl, setDemoUrl] = useState('https://paypal-security-update-center.org/login')

  return (
    <div className="space-y-24 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-8">
          <Shield className="h-3.5 w-3.5" /> Next-Gen AI Threat & Fraud Prevention
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Protect Yourself from <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">Digital Scams</span> and Fraud
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Instantly detect malicious SMS messages, suspicious WhatsApp texts, phishing URLs, and credential theft attempts using precision pattern heuristics and machine intelligence.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
            Live Security Demo
          </Button>
        </div>
      </section>

      {/* Interactive Demo Cards (Visual preview) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Demo Message Scanner */}
          <div className="rounded-2xl border border-white/10 bg-[#0a1628]/90 backdrop-blur p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                  <MessageSquare className="h-4 w-4" /> Message Threat Analyzer
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                  Sample Preview
                </span>
              </div>
              <p className="text-xs text-white/40 mb-3">Simulate checking incoming SMS, WhatsApp, or email drafts:</p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80 font-mono leading-relaxed h-28 overflow-hidden">
                {demoMessage}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/40">Risk Contribution: +85 High Urgency</span>
              <Button size="sm" onClick={() => navigate('/login')}>
                Scan Now <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Demo URL Scanner */}
          <div className="rounded-2xl border border-white/10 bg-[#0a1628]/90 backdrop-blur p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <Globe className="h-4 w-4" /> Phishing URL Checker
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold">
                  Sample Preview
                </span>
              </div>
              <p className="text-xs text-white/40 mb-3">Inspect target links safely without opening them:</p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/80 font-mono break-all h-28">
                {demoUrl}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/40">Typosquatting & Suspicious TLD Detected</span>
              <Button size="sm" onClick={() => navigate('/login')}>
                Scan Now <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">Comprehensive Protection Engine</h2>
          <p className="mt-3 text-white/50 text-base max-w-xl mx-auto">
            Engineered with deep cybersecurity standards to catch sophisticated social engineering attacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Heuristics</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Analyzes urgency indicators, pressure tactics, spoofed authority, and fraudulent financial keywords instantly.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">URL Deep-Inspection</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Dissects domain entropy, lookalike characters (homograph attacks), IP hostnames, and known phishing redirects.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Confidence Scoring</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Weighted rule evaluation outputs intuitive 0-100 severity risk scores with granular evidence cards.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-green-600/10 border border-green-500/20 text-green-400 mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Zero-Trust Memory</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Authentication tokens remain isolated in memory and secure HTTP-only cookies, never vulnerable in local storage.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-yellow-600/10 border border-yellow-500/20 text-yellow-400 mb-4">
              <EyeOff className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Full control over content persistence. Optionally sanitize and discard raw message payloads after inspection.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a1628] p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 w-fit rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 mb-4">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Actionable Defense</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Clear, step-by-step mitigation instructions for what to do if you suspect you've already interacted with a scam.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="mt-3 text-white/50 text-base max-w-lg mx-auto">
            Scan and verify any suspicious message or link in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="relative p-6">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
              1
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">Submit Suspicious Text/URL</h4>
            <p className="text-white/50 text-sm">
              Paste the text of any SMS, WhatsApp alert, or link into the scanner.
            </p>
          </div>

          <div className="relative p-6">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
              2
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">Automated Heuristic Evaluation</h4>
            <p className="text-white/50 text-sm">
              Our rust-powered detection engine cross-references social engineering and threat patterns.
            </p>
          </div>

          <div className="relative p-6">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center mx-auto mb-4 text-lg">
              3
            </div>
            <h4 className="text-white font-semibold text-lg mb-2">Immediate Risk Breakdown</h4>
            <p className="text-white/50 text-sm">
              Receive a scored threat verdict, detailed trigger findings, and safe handling guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-900/20 to-[#0a1628] p-10 sm:p-14 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay One Step Ahead of Fraudsters</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Join ScamShield today and secure your communications against modern phishing tactics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Create Free Account
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
