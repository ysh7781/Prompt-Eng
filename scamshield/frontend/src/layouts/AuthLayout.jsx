import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#020817] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">ScamShield</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#0a1628] py-8 px-6 shadow-2xl border border-white/10 sm:rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
