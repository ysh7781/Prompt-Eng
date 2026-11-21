import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Shield, ArrowUpRight } from 'lucide-react'
import { ScamShieldLogoMark } from './Navbar.jsx'

function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-neutral-50/60 pt-16 pb-12 text-sm text-neutral-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-200/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <ScamShieldLogoMark className="h-8 w-8" />
              <span className="font-nunito text-xl font-black text-neutral-900 tracking-tight">
                Scam<span className="text-brand">Shield</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm leading-relaxed">
              AI-powered digital safety assistant. Verify suspicious websites, SMS messages, phone numbers, and digital communications before you act.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Service Operational
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-neutral-900">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#why-scamshield" className="hover:text-brand transition-colors">Why ScamShield</a></li>
              <li><a href="#how-it-works" className="hover:text-brand transition-colors">How it Works</a></li>
              <li><a href="#engine" className="hover:text-brand transition-colors">Security Engine</a></li>
              <li><a href="#faq" className="hover:text-brand transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-neutral-900">
              Security Tools
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/scanner/message" className="hover:text-brand transition-colors">Message Scanner</Link></li>
              <li><Link to="/scanner/url" className="hover:text-brand transition-colors">URL Scanner</Link></li>
              <li><Link to="/history" className="hover:text-brand transition-colors">Scan History</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand transition-colors">Security Console</Link></li>
            </ul>
          </div>

          {/* Emergency Helpline */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-nunito text-xs font-bold uppercase tracking-wider text-neutral-900">
              Emergency Assistance
            </h4>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
              <p className="text-xs text-neutral-500 leading-snug">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} ScamShield. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-neutral-600 transition-colors">Privacy Policy</a>
            <a href="#faq" className="hover:text-neutral-600 transition-colors">Terms of Service</a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition-colors inline-flex items-center gap-1">
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
