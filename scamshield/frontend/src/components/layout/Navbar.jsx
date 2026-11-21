import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, User, LogOut, ChevronDown, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

export function ScamLensLogoMark({ className = 'h-10 w-auto', alt = 'ScamLens Logo' }) {
  return (
    <img
      src="/goggles-clean.png"
      alt={alt}
      className={`shrink-0 object-contain select-none transition-transform group-hover:scale-105 ${className}`}
    />
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
        <Link to="/" className="flex items-center gap-3 group">
          <ScamLensLogoMark className="h-10 sm:h-11 w-auto" />
          <div className="flex flex-col">
            <span className="font-nunito text-xl sm:text-2xl font-black tracking-tight text-neutral-900 leading-none">
              Scam<span className="text-brand">Lens</span>
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex text-sm font-semibold text-neutral-600">
          <a href="#why-scamlens" className="transition-colors hover:text-brand">
            Why ScamLens
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

          {/* Mobile Animated Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative flex h-9 w-9 items-center justify-center rounded-full bg-tint-blue text-brand hover:bg-blue-100/70 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Toggle navigation menu</span>
            <div className="relative flex flex-col items-center justify-center w-4 h-4">
              <span
                className={`block h-0.5 w-4 rounded-full bg-brand transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}
              />
              <span
                className={`block h-0.5 w-4 rounded-full bg-brand transition-all duration-200 ease-in-out ${
                  mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 my-0.5'
                }`}
              />
              <span
                className={`block h-0.5 w-4 rounded-full bg-brand transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'max-h-96 opacity-100 translate-y-0 mt-2 pointer-events-auto'
            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none mt-0'
        }`}
      >
        <div className="mx-auto max-w-7xl rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-4 shadow-xl space-y-1.5 transition-transform duration-300">
          <a
            href="#why-scamlens"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand transition-all group"
          >
            <span>Why ScamLens</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand transition-all group"
          >
            <span>How it Works</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
          </a>
          <a
            href="#engine"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand transition-all group"
          >
            <span>Engine</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-tint-blue hover:text-brand transition-all group"
          >
            <span>FAQ</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand" />
          </a>
          <div className="pt-3 mt-1 border-t border-neutral-100 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-neutral-700 hover:text-brand px-2 py-1 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/scanner/message"
              onClick={() => setMobileMenuOpen(false)}
              className="brand-gradient rounded-full px-5 py-2 text-xs font-bold text-white shadow-sm shadow-brand/25 hover:opacity-90 transition-all"
            >
              Scan a Message
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
