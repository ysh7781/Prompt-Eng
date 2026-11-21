import React, { useState } from 'react'
import { MessageSquare, AlertCircle, Shield, Trash2, ArrowRight } from 'lucide-react'
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
      setValidationError('Please enter a message or SMS to analyze.')
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
      // Handled via scanMutation.error
    }
  }

  const handleReset = () => {
    setContent('')
    setResult(null)
    setValidationError('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Message & SMS Scanner</h1>
        <p className="text-white/50 text-sm mt-1">
          Inspect text messages, WhatsApp alerts, banking notifications, or emails for social engineering tactics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-400" /> Message Payload
            </CardTitle>
            <CardDescription>
              Paste the exact raw message text below for heuristic pattern inspection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    if (validationError) setValidationError('')
                  }}
                  rows={8}
                  placeholder="e.g. URGENT: Your bank account is locked due to suspicious activity. Verify immediately at..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none font-mono"
                />
                <div className="flex justify-between items-center text-xs text-white/40 mt-1 px-1">
                  <span>Standard SMS & Social Engineering Rules Applied</span>
                  <span className={content.length > maxChars ? 'text-red-400 font-bold' : ''}>
                    {content.length}/{maxChars}
                  </span>
                </div>
              </div>

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
                        'Failed to analyze message. Please verify the backend service.'}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Privacy Toggle */}
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="saveContent"
                  checked={saveContent}
                  onChange={(e) => setSaveContent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="saveContent" className="text-xs text-white/70 cursor-pointer">
                  <span className="font-medium text-white block">Save content for audit history</span>
                  When checked, the message snippet is stored in your private history. If unchecked, only the threat score and findings are recorded.
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                {content && (
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
                  <Button type="submit" disabled={scanMutation.isPending || !content.trim()}>
                    {scanMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" /> Analyzing Threats...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Run Threat Scan <ArrowRight className="h-4 w-4" />
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
                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-base font-semibold text-white/80">Awaiting Message Input</h3>
                <p className="text-sm text-white/40 max-w-sm mt-1">
                  Paste content on the left and submit to trigger rule-based urgency, keyword, and credential-harvesting checks.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageScannerPage
