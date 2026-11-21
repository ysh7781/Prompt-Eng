import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { Button } from '../ui/Button.jsx'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="border-b border-[#E5EDF5] bg-white/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#EAF3FF] border border-[#E5EDF5]">
              <Shield className="h-5 w-5 text-[#172B4D]" />
            </div>
            <span className="text-lg font-bold text-[#172B4D] tracking-tight">ScamShield</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/#features" className="text-[#64748B] hover:text-[#172B4D] text-sm font-medium transition-colors">Features</Link>
                <Link to="/#how-it-works" className="text-[#64748B] hover:text-[#172B4D] text-sm font-medium transition-colors">How it Works</Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-[#64748B] hover:text-[#172B4D] text-sm font-medium transition-colors">Dashboard</Link>
                <Link to="/scanner/message" className="text-[#64748B] hover:text-[#172B4D] text-sm font-medium transition-colors">Message Scanner</Link>
                <Link to="/scanner/url" className="text-[#64748B] hover:text-[#172B4D] text-sm font-medium transition-colors">URL Scanner</Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F4F9FF] text-left transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#EAF3FF] border border-[#E5EDF5] flex items-center justify-center">
                      <span className="text-[#172B4D] text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#172B4D]">{user?.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#E5EDF5] shadow-lg py-1.5 z-50">
                        <div className="px-3 py-2 border-b border-[#E5EDF5]">
                          <p className="text-xs font-semibold text-[#172B4D] truncate">{user?.name}</p>
                          <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F4F9FF]"
                        >
                          <Shield className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#172B4D] hover:bg-[#F4F9FF]"
                        >
                          <User className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Profile & Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 w-full text-left"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#64748B] hover:text-[#172B4D] hover:bg-[#F4F9FF] rounded-lg transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#E5EDF5] py-4 space-y-2 bg-white">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/#features"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#64748B] hover:text-[#172B4D] font-medium"
                >
                  Features
                </Link>
                <Link
                  to="/#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#64748B] hover:text-[#172B4D] font-medium"
                >
                  How it Works
                </Link>
                <div className="pt-2 flex flex-col gap-2 px-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#172B4D] font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/scanner/message"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#64748B] hover:text-[#172B4D] font-medium"
                >
                  Message Scanner
                </Link>
                <Link
                  to="/scanner/url"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#64748B] hover:text-[#172B4D] font-medium"
                >
                  URL Scanner
                </Link>
                <div className="pt-2 px-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
