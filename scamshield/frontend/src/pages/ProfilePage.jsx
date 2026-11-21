import React, { useState } from 'react'
import { User, Mail, Shield, Calendar, LogOut, Check, Save } from 'lucide-react'
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account & Privacy Settings</h1>
        <p className="text-white/50 text-sm mt-1">
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity Overview</CardTitle>
          <CardDescription>Your registered account credentials and security clearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{user?.name || 'Authorized User'}</h3>
              <p className="text-sm text-white/50">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 capitalize font-medium">
                  <Shield className="h-3 w-3" /> {user?.role || 'User'}
                </span>
                <span className="text-white/40 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Member since {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : '2024'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  id="displayName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="userEmail">Registered Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <Input
                  id="userEmail"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-9 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-white/30">Email address cannot be modified once provisioned.</p>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy & Retention Controls</CardTitle>
          <CardDescription>Control how your scan payloads are stored on ScamShield servers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <p className="text-sm font-medium text-white">Default to Storing Message Snippets</p>
              <p className="text-xs text-white/50 mt-0.5">
                Automatically keep the original scanned message or URL payload in your audit history. Disable this if you regularly scan high-sensitivity confidential text.
              </p>
            </div>
            <input
              type="checkbox"
              checked={savePreference}
              onChange={(e) => setSavePreference(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div>
              <p className="text-sm font-medium text-white">Anonymous Threat Contribution</p>
              <p className="text-xs text-white/50 mt-0.5">
                Help improve heuristic rules by sharing anonymized scam indicator patterns.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sign Out Card */}
      <Card className="border-red-500/20 bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-base text-red-400">Session Management</CardTitle>
          <CardDescription>Terminates your current access session and invalidates auth tokens.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> End Session & Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
