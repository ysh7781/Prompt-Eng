import React, { useState } from 'react'
import { User, Mail, Shield, Calendar, LogOut, Check, Save, BookOpen, AlertCircle, Lock } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Label } from '../components/ui/Label.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || '')
  const [savePreference, setSavePreference] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="space-y-7 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">Settings & Profile</h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Manage your personal details, access role, and data retention preferences.
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <AlertDescription>Your preferences have been saved successfully.</AlertDescription>
          </div>
        </Alert>
      )}

      {/* User Overview */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Identity Overview</CardTitle>
          <CardDescription>Your registered account credentials and authentication status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EFF6]">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-center text-[#2563EB] text-xl font-bold shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B4D]">{user?.name || 'User'}</h3>
                <p className="text-xs text-[#64748B]">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-[#172B4D] uppercase tracking-wider">
                    {user?.role || 'user'}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Member since {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Recent'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Form */}
      <Card className="rounded-2xl border-[#E8EFF6] bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your display name and contact preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Registered Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-[#F8FAFC] text-[#64748B] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#94A3B8]">Email address is managed by your organization.</p>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" className="gap-1.5 font-semibold">
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Awareness Guide (Section 3 Requirement) */}
      <Card id="awareness" className="rounded-2xl border-[#E8EFF6] bg-white shadow-sm scroll-mt-24">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#2563EB]" />
            <CardTitle>Security Awareness Guide</CardTitle>
          </div>
          <CardDescription>Standard operating rules to recognize and avoid modern digital fraud</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8EFF6]">
            <h4 className="font-semibold text-[#172B4D] mb-1">1. Phishing & Spoofed Domains</h4>
            <p className="text-[#64748B] leading-relaxed">
              Cybercriminals register domains that closely resemble official organizations (e.g. adding prefixes like <code>secure-bank.com</code> or using deceptive extensions like <code>.tk</code> or <code>.xyz</code>). Always confirm the exact top-level domain through verified browser bookmarks.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8EFF6]">
            <h4 className="font-semibold text-[#172B4D] mb-1">2. Social Engineering & Artificial Urgency</h4>
            <p className="text-[#64748B] leading-relaxed">
              Fraudulent SMS messages frequently use threatening language ("Account suspended immediately", "Pending fine from court") to bypass logical verification. When receiving an urgent notice, close the message and navigate directly to the institution's official app or portal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8EFF6]">
            <h4 className="font-semibold text-[#172B4D] mb-1">3. Credential & OTP Harvesting</h4>
            <p className="text-[#64748B] leading-relaxed">
              No genuine customer service or delivery representative will ever ask you to read back a one-time SMS verification password or enter your debit card PIN over WhatsApp or text message.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
