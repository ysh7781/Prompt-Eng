import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-tint-blue selection:text-brand font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
