import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, Menu, User, LogOut, ChevronDown, ShieldCheck, Sun } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Monitor threats and security metrics in real time' },
  '/scanner/message': { title: 'Message Security Scanner', sub: 'Powered by ScamLens AI Detection Engine' },
  '/scanner/url': { title: 'URL Security Scanner', sub: 'Inspect links safely before visiting' },
  '/history': { title: 'Scan History', sub: 'Audit log of all analyzed communications' },
  '/profile': { title: 'Profile & Settings', sub: 'Manage account security and preferences' },
  '/admin': { title: 'Detection Rules Management', sub: 'Configure fraud detection heuristics' },
}

function TopNav({ onToggleMobile }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'ScamLens', sub: 'Cybersecurity Dashboard' }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="h-20 px-6 sm:px-8 flex items-center justify-between border-b border-[#E8EFF6]/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">{pageInfo.title}</h1>
          <p className="text-xs text-[#64748B] hidden sm:block">{pageInfo.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status Indicator Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-medium text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Engine Online</span>
        </div>

        {/* Notifications Icon (Image 2 style with counter badge) */}
        <button
          className="p-2.5 text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        {/* Theme Icon (neutral) */}
        <button
          className="p-2.5 text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
          title="System Light Mode"
        >
          <Sun className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User profile menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300/60 flex items-center justify-center text-xs font-bold text-[#172B4D]">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-[#172B4D] block leading-tight">{user?.name || 'Account'}</span>
              <span className="text-[10px] text-[#64748B] block leading-tight">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#E8EFF6] shadow-xl py-2 z-50">
                <div className="px-3.5 py-2 border-b border-[#E8EFF6]">
                  <p className="text-xs font-semibold text-[#172B4D] truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#172B4D] hover:bg-[#F4F8FD]"
                >
                  <User className="h-3.5 w-3.5 text-[#64748B]" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 w-full text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav
