import React, { useState } from 'react'
import { Globe, Shield, ArrowRight, Trash2, AlertCircle, Sparkles, Lock, ExternalLink } from 'lucide-react'
import { useUrlScanner } from '../hooks/useScanner.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import ScanResult from '../components/scanner/ScanResult.jsx'

function UrlScannerPage() {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')
  const [result, setResult] = useState(null)

  const scanMutation = useUrlScanner()

  const validateUrl = (string) => {
    try {
      const testStr = string.startsWith('http://') || string.startsWith('https://') ? string : `https://${string}`
      new URL(testStr)
      return true
    } catch (_) {
      return false
    }
  }

  const handleScan = async (e) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) {
      setValidationError('Please enter a target web URL to inspect.')
      return
    }
    if (!validateUrl(trimmed)) {
      setValidationError('Please enter a valid URL (e.g. https://example.com or http://192.168.1.1).')
      return
    }

    setValidationError('')
    try {
      const response = await scanMutation.mutateAsync({
        url: trimmed,
      })
      setResult(response.data)
    } catch (err) {
      // Handled in UI
    }
  }

  const handleReset = () => {
    setUrl('')
    setResult(null)
    setValidationError('')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header (Image 2 style) */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#0F1E36] flex items-center justify-center text-white shadow-sm shrink-0">
          <Globe className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
            URL Security Scanner
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Inspect links safely before visiting • Zero execution sandbox
          </p>
        </div>
      </div>

      {/* Main Scan Card (Image 2 style) */}
      <Card className="rounded-3xl border-[#E8EFF6] bg-white p-6 sm:p-10 shadow-[0_4px_24px_rgba(23,43,77,0.05)]">
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200/80 text-[11px] font-semibold text-[#2563EB] mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Quick & Comprehensive Scanning</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] tracking-tight">
            Start New Scan
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Enter target URL for comprehensive vulnerability, homograph, and phishing analysis.
          </p>
        </div>

        {validationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {scanMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {scanMutation.error?.response?.data?.message || 'Failed to complete URL analysis. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Globe className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (validationError) setValidationError('')
              }}
              placeholder="https://example.com/login-verification..."
              className="w-full h-14 rounded-2xl border border-[#E2EAF2] bg-[#F8FAFC] pl-11 pr-20 text-sm text-[#172B4D] placeholder:text-[#94A3B8] shadow-inner focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-all"
            />
            {url && (
              <button
                type="button"
                onClick={handleReset}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              <span>Safe analysis: Never executes JavaScript or arbitrary redirects</span>
            </div>
          </div>

          {/* Centered Launch Scan Button (Image 2 style) */}
          <div className="pt-3 flex justify-center">
            <Button
              type="submit"
              disabled={scanMutation.isPending}
              className="h-12 px-8 rounded-xl font-semibold text-sm shadow-md gap-2"
            >
              {scanMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span>Inspecting URL Structure...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Launch Security Scan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Analysis Results Display */}
      {result && (
        <div className="pt-2">
          <ScanResult result={result} />
        </div>
      )}
    </div>
  )
}

export default UrlScannerPage
