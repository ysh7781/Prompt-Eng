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
    <nav className="border-b border-white/10 bg-[#020817]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-lg font-bold text-white">ScamShield</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/#features" className="text-white/60 hover:text-white text-sm transition-colors">Features</Link>
                <Link to="/#how-it-works" className="text-white/60 hover:text-white text-sm transition-colors">How it Works</Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors">Dashboard</Link>
                <Link to="/scanner/message" className="text-white/60 hover:text-white text-sm transition-colors">Message Scanner</Link>
                <Link to="/scanner/url" className="text-white/60 hover:text-white text-sm transition-colors">URL Scanner</Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                      <span className="text-blue-400 text-xs font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0a1628] shadow-xl py-1 z-50">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-white/40 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#020817] px-4 py-4 space-y-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="block text-white/70 hover:text-white py-2">Sign In</Link>
              <Link to="/register" className="block"><Button className="w-full" size="sm">Get Started</Button></Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block text-white/70 hover:text-white py-2">Dashboard</Link>
              <Link to="/scanner/message" className="block text-white/70 hover:text-white py-2">Message Scanner</Link>
              <Link to="/scanner/url" className="block text-white/70 hover:text-white py-2">URL Scanner</Link>
              <Link to="/history" className="block text-white/70 hover:text-white py-2">History</Link>
              <Link to="/profile" className="block text-white/70 hover:text-white py-2">Profile</Link>
              <button onClick={handleLogout} className="block text-red-400 hover:text-red-300 py-2">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

