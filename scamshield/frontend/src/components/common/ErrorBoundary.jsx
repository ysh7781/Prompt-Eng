import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F9FF] flex items-center justify-center p-6 text-[#172B4D]">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E8EFF6] shadow-xl p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-rose-50 border border-rose-200 rounded-2xl mx-auto flex items-center justify-center text-rose-600">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-sm text-[#64748B]">
                The application encountered an unexpected error. Please try reloading the page or return to the home screen.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono text-xs text-rose-700 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-all shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#E8EFF6] bg-white hover:bg-[#F8FAFC] text-[#172B4D] text-sm font-medium transition-all"
              >
                <Home className="h-4 w-4 text-[#64748B]" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
