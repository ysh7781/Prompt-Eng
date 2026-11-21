import React, { useState } from 'react'
import { Globe, AlertCircle, Shield, ArrowRight, Trash2, ExternalLink } from 'lucide-react'
import { useUrlScanner } from '../hooks/useScanner.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Alert, AlertDescription } from '../components/ui/Alert.jsx'
import { Spinner } from '../components/ui/Spinner.jsx'
import ScanResult from '../components/scanner/ScanResult.jsx'

function UrlScannerPage() {
  const [url, setUrl] = useState('')
  const [saveContent, setSaveContent] = useState(true)
  const [validationError, setValidationError] = useState('')
  const [result, setResult] = useState(null)

  const scanMutation = useUrlScanner()

  const validateUrl = (string) => {
    try {
      // If no protocol, test with https
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
      setValidationError('Please enter a URL or web address to analyze.')
      return
    }
    if (!validateUrl(trimmed)) {
      setValidationError('Please enter a valid URL (e.g., https://example.com or example.com).')
      return
    }

    setValidationError('')
    try {
      const response = await scanMutation.mutateAsync({
        url: trimmed,
        save_content: saveContent,
      })
      setResult(response.data)
    } catch (err) {
      // Handled via scanMutation.error
    }
  }

  const handleReset = () => {
    setUrl('')
    setResult(null)
    setValidationError('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Phishing & URL Scanner</h1>
        <p className="text-white/50 text-sm mt-1">
          Safely inspect web links for typosquatting, deceptive domain structures, IP hosts, and fraudulent redirect paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-400" /> Target URL
            </CardTitle>
            <CardDescription>
              We analyze the domain and path heuristics without directly navigating to the target website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              <div className="space-y-1.5">
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="https://paypal-security-update.suspicious-domain.com/login"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    className="pl-9 font-mono text-sm"
                  />
                </div>
              </div>

              {url && (
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <span className="text-white/40 block mb-1">Safe Display Preview:</span>
                  <p className="text-blue-300 font-mono break-all select-all">{url}</p>
                </div>
              )}

              {validationError && (
                <Alert variant="destructive">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </div>
                </Alert>
              )}

              {scanMutation.isError && (
                <Alert variant="destructive">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {scanMutation.error?.response?.data?.message ||
                        scanMutation.error?.response?.data?.error ||
                        'Failed to inspect URL. Please check backend connectivity.'}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Privacy Checkbox */}
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="saveUrlContent"
                  checked={saveContent}
                  onChange={(e) => setSaveContent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveUrlContent" className="text-xs text-white/70 cursor-pointer">
                  <span className="font-medium text-white block">Log URL into scan records</span>
                  Keep this link in your private history for audit trails and statistical tracking.
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                {url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-white/40 hover:text-white gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </Button>
                )}
                <div className="ml-auto">
                  <Button type="submit" disabled={scanMutation.isPending || !url.trim()}>
                    {scanMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" /> Scanning URL...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Inspect URL <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div>
          {result ? (
            <ScanResult result={result} />
          ) : (
            <Card className="border-dashed border-white/10 bg-transparent">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-base font-semibold text-white/80">Awaiting URL Submission</h3>
                <p className="text-sm text-white/40 max-w-sm mt-1">
                  Enter any link to test against punycode exploits, IP hosts, domain randomness, and known phishing triggers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default UrlScannerPage
