import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Shield, ArrowUpRight } from 'lucide-react'
import { ScamLensLogoMark } from './Navbar.jsx'

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-[#070D18] pt-16 pb-12 text-sm text-slate-300">
      {/* Code Matrix Background Image (User Photo) with dark overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/footer-bg.jpg"
          alt="Security Code Matrix Background"
          className="w-full h-full object-cover object-center opacity-35 filter saturate-150 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#070D18]/85 to-[#0A1322]/90 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <ScamLensLogoMark className="h-10 w-auto drop-shadow-[0_0_12px_rgba(37,99,235,0.45)]" />
              <span className="font-nunito text-2xl font-black text-white tracking-tight">
                Scam<span className="text-blue-400">Lens</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm leading-relaxed">
              AI-powered digital safety assistant. Verify suspicious websites, SMS messages, phone numbers, and digital communications before you act.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Service Operational
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#why-scamlens" className="text-slate-300 hover:text-blue-400 transition-colors">Why ScamLens</a></li>
              <li><a href="#how-it-works" className="text-slate-300 hover:text-blue-400 transition-colors">How it Works</a></li>
              <li><a href="#engine" className="text-slate-300 hover:text-blue-400 transition-colors">Security Engine</a></li>
              <li><a href="#faq" className="text-slate-300 hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-white">
              Security Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/scanner/message" className="text-slate-300 hover:text-blue-400 transition-colors">Message Scanner</Link></li>
              <li><Link to="/scanner/url" className="text-slate-300 hover:text-blue-400 transition-colors">URL Scanner</Link></li>
              <li><Link to="/history" className="text-slate-300 hover:text-blue-400 transition-colors">Scan History</Link></li>
              <li><Link to="/dashboard" className="text-slate-300 hover:text-blue-400 transition-colors">Security Console</Link></li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-white">
              Emergency Assistance
            </h4>
            <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 shadow-lg space-y-2 text-neutral-900">
              <p className="text-xs text-neutral-600 leading-snug">
                Victim of cyber fraud or unauthorized bank transfer? Report immediately:
              </p>
              <a
                href="tel:1930"
                className="inline-flex items-center gap-2 font-nunito font-extrabold text-sm text-brand hover:underline"
              >
                <Phone className="h-4 w-4" />
                <span>Call Helpline 1930</span>
              </a>
              <p className="text-[11px] text-neutral-400">National Cyber Crime Reporting Portal</p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ScamLens. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">Terms of Service</a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors inline-flex items-center gap-1">
              <span>cybercrime.gov.in</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
