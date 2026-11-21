import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  MessageSquare,
  Globe,
  History,
  BookOpen,
  Settings,
  LogOut,
  Sliders,
  Search,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { cn } from '../../utils/cn.js'

const mainMenuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { to: '/scanner/message', icon: MessageSquare, label: 'Message Scanner', badge: 'AI' },
  { to: '/scanner/url', icon: Globe, label: 'URL Scanner', badge: null },
  { to: '/history', icon: History, label: 'Scan History', badge: null },
]

const preferenceItems = [
  { to: '/profile#awareness', icon: BookOpen, label: 'Security Awareness' },
  { to: '/profile', icon: Settings, label: 'Profile & Settings' },
]

function Sidebar({ onCloseMobile }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="flex flex-col h-full w-[270px] bg-white/80 backdrop-blur-md border-r border-[#E8EFF6] p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-2 mb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
          <Shield className="h-5 w-5 fill-white/20" />
        </div>
        <div>
          <span className="text-base font-bold text-[#172B4D] tracking-tight block">ScamShield</span>
          <span className="text-[11px] font-medium text-[#64748B] block">Security Suite</span>
        </div>
      </div>

      {/* Quick Search Input (Image 1 style) */}
      <div className="mb-5 px-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4F8FD] border border-[#E8EFF6] text-xs text-[#64748B] focus-within:border-blue-500/40 focus-within:bg-white transition-all">
          <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full bg-transparent border-none text-xs text-[#172B4D] placeholder:text-[#94A3B8] focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-6 px-1 pr-2">
        {/* Main Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Menu
          </div>
          <div className="space-y-1">
            {mainMenuItems.map(({ to, icon: Icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-white shadow-[0_2px_8px_rgba(23,43,77,0.06)] border border-[#E8EFF6] text-[#172B4D] font-semibold'
                      : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white/60 font-medium',
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[#64748B]" />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] border border-blue-200/60">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Preferences
          </div>
          <div className="space-y-1">
            {preferenceItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-white shadow-[0_2px_8px_rgba(23,43,77,0.06)] border border-[#E8EFF6] text-[#172B4D] font-semibold'
                      : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white/60 font-medium',
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[#64748B]" />
                  <span>{label}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />
              </NavLink>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Admin Controls
            </div>
            <div className="space-y-1">
              <NavLink
                to="/admin"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-white shadow-[0_2px_8px_rgba(23,43,77,0.06)] border border-[#E8EFF6] text-[#172B4D] font-semibold'
                      : 'text-[#64748B] hover:text-[#172B4D] hover:bg-white/60 font-medium',
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Sliders className="h-4 w-4 shrink-0 text-[#64748B]" />
                  <span>Detection Rules</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />
              </NavLink>
            </div>
          </div>
        )}
      </div>

      {/* User profile card at bottom (Image 1 style) */}
      <div className="pt-3 border-t border-[#E8EFF6]">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8EFF6] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-center justify-center text-xs font-bold text-[#2563EB] shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#172B4D] truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-[#64748B] truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
