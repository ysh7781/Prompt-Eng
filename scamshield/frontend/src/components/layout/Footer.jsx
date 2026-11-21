import React from 'react'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020817] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-lg font-bold text-white">ScamShield</span>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              AI-powered protection against digital scams, phishing URLs, and fraudulent messages.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-3">Product</h3>
            <ul className="space-y-2">
              {['Features', 'How it Works', 'Pricing', 'API'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2024 ScamShield. All rights reserved.</p>
          <p className="text-white/30 text-xs">Built with ❤️ to protect you online</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

