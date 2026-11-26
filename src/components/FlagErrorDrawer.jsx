import React, { useState } from 'react'
import { X, Flag, AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { apiService } from '../api/client'

export default function FlagErrorDrawer({ isOpen, onClose, topic }) {
  const [section, setSection] = useState('goldenAnchors')
  const [lineRef, setLineRef] = useState('')
  const [comment, setComment] = useState('')
  const [suggestedFix, setSuggestedFix] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const sections = [
    { id: 'goldenAnchors', label: 'Golden Anchors (DOC / IOC / MCC)' },
    { id: 'twinsMatrix', label: 'Twins Matrix Differentiator' },
    { id: 'completeChecklist', label: '10m Checklist Domain' },
    { id: 'trapsAndMnemonics', label: 'Traps & Mnemonics' },
    { id: 'mcq', label: 'MCQ & Rule-Out Option' },
    { id: 'general', label: 'General Clinical Discrepancy' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      setErrorMsg('Please describe the clinical discrepancy.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      await apiService.flagError({
        topicId: topic?.id,
        section,
        lineRef: lineRef.trim() || 'General Card',
        comment: comment.trim(),
        suggestedFix: suggestedFix.trim() || undefined,
      })

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
        setComment('')
        setSuggestedFix('')
        setLineRef('')
      }, 1800)
    } catch (err) {
      console.error('Flag submit error:', err)
      setErrorMsg(err.response?.data?.message || 'Failed to submit clinical flag.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-lg mx-auto bg-obsidian-900 border-t border-obsidian-700 rounded-t-3xl shadow-sheet p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Drag Handle */}
        <div className="w-9 h-1 bg-obsidian-600 rounded-full mx-auto mb-1 cursor-grab" onClick={onClose} />

        <div className="flex items-center justify-between border-b border-obsidian-700/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Flag Clinical Discrepancy
              </h3>
              <p className="text-[11px] text-obsidian-400 font-medium">
                Audited by our editorial board of MD specialists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-obsidian-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Flag Submitted</h4>
            <p className="text-xs text-obsidian-400 max-w-xs mx-auto">
              Your observation has been queued for specialist editorial verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-obsidian-300 mb-1">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-xs focus:border-cliniq-pharm focus:outline-none"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-300 mb-1">
                Line Reference (Optional)
              </label>
              <input
                type="text"
                value={lineRef}
                onChange={(e) => setLineRef(e.target.value)}
                placeholder="e.g. DOC regimen phase or Option C"
                className="w-full p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-xs focus:border-cliniq-pharm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-300 mb-1">
                Clinical Observation *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                placeholder="Describe the discrepancy with guideline reference (e.g. KDT 9e, Robbins 11e, Park 27e, NTEP 2024)..."
                className="w-full p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-xs focus:border-cliniq-pharm focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-300 mb-1">
                Suggested Replacement (Optional)
              </label>
              <input
                type="text"
                value={suggestedFix}
                onChange={(e) => setSuggestedFix(e.target.value)}
                placeholder="e.g. BPaLM regimen 26 weeks as per NTEP update"
                className="w-full p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white text-xs focus:border-cliniq-pharm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Specialist Audit</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
