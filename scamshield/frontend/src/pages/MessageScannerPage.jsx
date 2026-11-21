import React, { useState } from 'react'
import { MessageSquare, Shield, Trash2, ArrowRight, AlertCircle, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { useMessageScanner } from '../hooks/useScanner.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import ScanResult from '../components/scanner/ScanResult.jsx'

function MessageScannerPage() {
  const [content, setContent] = useState('')
  const [saveContent, setSaveContent] = useState(true)
  const [validationError, setValidationError] = useState('')
  const [result, setResult] = useState(null)

  const scanMutation = useMessageScanner()
  const maxChars = 5000

  const handleScan = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      setValidationError('Please enter or paste a message to analyze.')
      return
    }
    if (content.length > maxChars) {
      setValidationError(`Content exceeds maximum allowed limit of ${maxChars} characters.`)
      return
    }

    setValidationError('')
    try {
      const response = await scanMutation.mutateAsync({
        content: content.trim(),
        save_content: saveContent,
      })
      setResult(response.data)
    } catch (err) {
      // Handled in UI
    }
  }

  const handleReset = () => {
    setContent('')
    setResult(null)
    setValidationError('')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header (Image 2 style) */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#0F1E36] flex items-center justify-center text-white shadow-sm shrink-0">
          <Shield className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight">
            Message Security Scanner
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Powered by ScamShield AI Detection Engine
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
            Check suspicious SMS, WhatsApp alerts, or emails for social engineering tactics.
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
              {scanMutation.error?.response?.data?.message || 'Failed to complete message analysis. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (validationError) setValidationError('')
              }}
              placeholder="Paste suspicious SMS, WhatsApp message, or email text here... (e.g. 'URGENT: Your bank account has been locked. Verify immediately at http://...')"
              rows={5}
              className="w-full rounded-2xl border border-[#E2EAF2] bg-[#F8FAFC] p-4 text-sm text-[#172B4D] placeholder:text-[#94A3B8] shadow-inner focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none transition-all resize-y"
            />
            <div className="absolute right-3.5 bottom-3.5 text-[11px] font-mono text-[#94A3B8] bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
              {content.length}/{maxChars}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 text-[11px] text-[#64748B] px-1">
            <ShieldAlert className="h-4 w-4 text-[#94A3B8] shrink-0 mt-0.5" />
            <p>
              Your message is analyzed for suspicious indicators. Avoid submitting passwords, OTPs, or other sensitive credentials.
            </p>
          </div>

          {/* Audit Logging Toggle */}
          <div className="flex items-center justify-between pt-1 px-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#64748B] hover:text-[#172B4D]">
              <input
                type="checkbox"
                checked={saveContent}
                onChange={(e) => setSaveContent(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span>Save message in audit history for personal records</span>
            </label>
            {content && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#94A3B8] hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Centered Launch Scan Button (Image 2 style) */}
          <div className="pt-3 flex justify-center">
            <Button
              type="submit"
              disabled={scanMutation.isPending || !content.trim()}
              aria-label="Launch Security Scan - Run Threat Scan"
              className="h-12 px-8 rounded-xl font-semibold text-sm shadow-md gap-2"
            >
              {scanMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  <span>Analyzing Threat Indicators...</span>
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

export default MessageScannerPage
