import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Shield, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react'

function AuthLayout() {
  return (
    <div className="min-h-screen auth-ambient-gradient flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header Logo */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full mb-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/goggles-clean.png" alt="ScamShield Logo" className="h-11 w-auto object-contain shrink-0" />
          <span className="text-2xl font-bold text-[#172B4D] tracking-tight">ScamShield</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-medium text-[#64748B] hover:text-[#172B4D] flex items-center gap-1 transition-colors"
        >
          <span>Back to Home</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Split Body (Image 4 style) */}
      <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-6">
        {/* Left Side: Value Proposition */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#E8EFF6] text-xs font-semibold text-[#2563EB] shadow-sm">
            <Lock className="h-3.5 w-3.5" />
            <span>Enterprise-Grade Fraud Defense</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-[#172B4D] tracking-tight leading-[1.15]">
            Fast, Efficient and Protective.
          </h1>

          <p className="text-base text-[#64748B] leading-relaxed max-w-md">
            ScamShield automatically inspects SMS, messaging links, and payment verification requests to shield you from evolving cyber fraud in real-time.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Explainable AI risk scoring with pinpoint rule triggers',
              'Deterministic heuristics with 0% false credential collection',
              'Real-time phishing URL detection & domain spoof analyzer',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium text-[#2D3F5D]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Floating Pure White Card (Image 4 style) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(23,43,77,0.08)] border border-[#E8EFF6] p-8 sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer Links (Image 4 style) */}
      <div className="max-w-6xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
        <div className="flex items-center gap-6">
          <span className="font-medium text-[#172B4D]">English (US)</span>
          <Link to="/" className="hover:text-[#172B4D] transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-[#172B4D] transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-[#172B4D] transition-colors">Contact Support</Link>
        </div>
        <p>© 2026 ScamShield Security. All rights reserved.</p>
      </div>
    </div>
  )
}

export default AuthLayout
