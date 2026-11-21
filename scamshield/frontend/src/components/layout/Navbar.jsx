import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, User, LogOut, ChevronDown, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

export function ScamShieldLogoMark({ className = 'h-8 w-8' }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-tint-blue text-brand p-1.5 ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield with fingerprint/circuit lines */}
        <path
          d="M16 3.5L26 7.5V14.5C26 21.5 21.5 26.5 16 28.5C10.5 26.5 6 21.5 6 14.5V7.5L16 3.5Z"
          fill="url(#logoGrad)"
          stroke="#0265DC"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14V17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 17C14 15.8954 14.8954 15 16 15C17.1046 15 18 15.8954 18 17V19" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="22" r="1" fill="#FFFFFF" />
        <defs>
          <linearGradient id="logoGrad" x1="6" y1="3.5" x2="26" y2="28.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14C4F4" />
            <stop offset="1" stopColor="#0265DC" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="mx-auto flex h-fit w-full max-w-7xl items-center justify-between rounded-full border border-neutral-200/70 bg-white/80 pr-4 pl-4 py-2 shadow-sm shadow-neutral-950/5 backdrop-blur-xl md:pl-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <ScamShieldLogoMark className="h-9 w-9" />
          <div className="flex flex-col">
            <span className="font-nunito text-lg sm:text-xl font-black tracking-tight text-neutral-900 leading-none">
              Scam<span className="text-brand">Shield</span>
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex text-sm font-semibold text-neutral-600">
          <a href="#why-scamshield" className="transition-colors hover:text-brand">
            Why ScamShield
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-brand">
            How it Works
          </a>
          <a href="#engine" className="transition-colors hover:text-brand">
            Engine
          </a>
          <a href="#faq" className="transition-colors hover:text-brand">
            FAQ
          </a>
        </nav>

        {/* Right CTA / Auth Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-tint-blue text-brand font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-bold text-neutral-800 hidden sm:inline">{user?.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-500 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/scanner/message"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
                    >
                      Message Scanner
                    </Link>
                    <Link
                      to="/scanner/url"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
                    >
                      URL Scanner
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-block text-xs font-bold text-neutral-700 hover:text-brand px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/scanner/message"
                className="brand-gradient rounded-full px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm shadow-brand/25 transition-all hover:opacity-90 hover:shadow-md"
              >
                Try Now
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-tint-blue text-brand"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-2xl border border-neutral-100 bg-white/95 backdrop-blur-xl p-4 shadow-xl space-y-2">
          <a
            href="#why-scamshield"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
          >
            Why ScamShield
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
          >
            How it Works
          </a>
          <a
            href="#engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
          >
            Engine
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand"
          >
            FAQ
          </a>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-neutral-700"
            >
              Sign In
            </Link>
            <Link
              to="/scanner/message"
              onClick={() => setMobileMenuOpen(false)}
              className="brand-gradient rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              Scan a Message
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
