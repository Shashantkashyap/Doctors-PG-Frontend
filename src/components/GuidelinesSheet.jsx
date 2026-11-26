import React from 'react'
import {
  X,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { cn } from '../utils/cn'
import AnimatedDoctorGuide from './AnimatedDoctorGuide'

export default function GuidelinesSheet({
  isOpen,
  onClose,
  guidelines,
  topicTitle = 'Clinical Topic',
  subjectCode = 'PHARM',
  onStartMcqs,
}) {
  if (!guidelines) return null

  const programName =
    guidelines.program ||
    guidelines.title ||
    'National Health Program Guidelines'

  const controversy = guidelines.examControversyAlert
  const keyUpdates = guidelines.keyUpdates

  // Format updates into clean bullets if array or newline separated
  const formattedUpdates = Array.isArray(keyUpdates)
    ? keyUpdates
    : typeof keyUpdates === 'string'
    ? keyUpdates.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs sheet-backdrop',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Tap backdrop to dismiss */}
      <div
        className="flex-1 cursor-pointer"
        onClick={onClose}
        aria-label="Dismiss guidelines sheet"
      />

      {/* Sheet Surface - Pure Architectural Slate with iOS Curve */}
      <div
        className={cn(
          'w-full max-w-lg mx-auto bg-[#0E121E] border-t border-[#222B40] rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] sheet-surface overflow-hidden',
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        )}
      >
        {/* Drag Pill */}
        <div
          className="pt-3 pb-1 flex justify-center cursor-pointer group"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-[#283550] group-hover:bg-[#3E4F76] rounded-full transition-colors" />
        </div>

        {/* Sheet Header with Mini Doctor & Close */}
        <div className="px-5 py-3 border-b border-[#1A2234] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#141A29] border border-[#232D44] flex items-center justify-center shrink-0">
              <AnimatedDoctorGuide className="w-8 h-9" hasAlert={false} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-bold">
                  Tier 3 Quarantine
                </span>
                <span className="text-[11px] text-zinc-500">·</span>
                <span className="text-[10px] font-mono text-zinc-400 font-medium">
                  {subjectCode}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight leading-snug truncate mt-0.5">
                {programName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#141A29] hover:bg-[#1E273C] text-zinc-400 hover:text-white border border-[#232D44] flex items-center justify-center transition-all cursor-pointer shrink-0 ml-2 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4">
          {/* 1. Official Program Status Card */}
          <div className="p-3.5 rounded-2xl bg-[#121624] border border-[#20293E] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                Active National Health Program
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" />
                GoI Verified
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug">
              {topicTitle} — National Operational Guidelines
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Official protocol recognized in Government of India health portals and National Board of Examinations (NBE) answer keys.
            </p>
          </div>

          {/* 2. ⚡ The Controversy Resolver (Quarantine Card) */}
          {controversy && (
            <div className="p-4 rounded-2xl bg-[#18130B] border border-amber-600/35 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  ⚡ NBE Exam Controversy Resolver
                </h4>
              </div>

              <div className="p-3 rounded-xl bg-[#120F08] border border-amber-600/25 text-xs text-amber-100/95 leading-relaxed font-mono">
                {controversy}
              </div>

              <p className="text-[11px] text-amber-300/80 leading-relaxed pl-0.5 font-sans">
                <strong>Why this is quarantined:</strong> Standard textbooks (e.g. KD Tripathi, Robbins) and National Health Program answer keys sometimes differ. In NEET PG / INI-CET, answer this guideline rule whenever the question mentions national programs.
              </p>
            </div>
          )}

          {/* 3. Key Clinical Updates & Regimen Modifications */}
          {formattedUpdates.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#121624] border border-[#20293E] space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                Key Regimen & Diagnostic Modifications
              </h4>

              <div className="divide-y divide-[#1D2538] text-xs">
                {formattedUpdates.map((update, idx) => (
                  <div
                    key={idx}
                    className="py-2 first:pt-0 last:pb-0 flex items-start gap-2 text-zinc-200 leading-relaxed"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                    <span className="flex-1">{update}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Exam Strategy Tip */}
          <div className="p-3 rounded-xl bg-[#141926] border border-[#20273A] text-[11px] text-zinc-300 flex items-center gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <p className="leading-snug">
              Re-checked against latest 2024 NBE exam patterns. Bookmark this card to <strong>20th Notebook</strong> for rapid active recall before exam day.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#1A2234] bg-[#0E121E] flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>Understood · Return to Capsule</span>
          </button>

          {onStartMcqs && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onStartMcqs()
              }}
              className="py-2.5 px-3.5 rounded-xl bg-[#182030] hover:bg-[#202B40] text-zinc-200 hover:text-white font-medium text-xs border border-[#252E44] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Solve MCQs</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
