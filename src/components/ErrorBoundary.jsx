import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center mb-3 shadow-xs">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="text-base font-bold text-[#053F5C] mb-1">
            Clinical Recall Recovery
          </h2>
          <p className="text-xs text-[#5C768D] max-w-sm mb-4 leading-relaxed">
            A temporary display error occurred in this section. Your progress and bookmarks are safely saved.
          </p>
          <button
            onClick={this.handleReset}
            className="py-2 px-4 rounded-xl bg-[#053F5C] hover:bg-[#032B40] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9FE7F5]" />
            <span>Reload Section</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
