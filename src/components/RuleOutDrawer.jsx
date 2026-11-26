import React from 'react'
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react'
import { cn } from '../utils/cn'

export default function RuleOutDrawer({
  isOpen,
  onClose,
  question,
  selectedIndex,
  onNextQuestion,
  isLastQuestion,
}) {
  if (!question) return null

  const isUserCorrect = selectedIndex === question.correctIndex
  const options = question.options || []
  const explanations = question.ruleOutExplanations || []
  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs sheet-backdrop',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop tap to close */}
      <div
        className="flex-1 cursor-pointer"
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* Drawer Surface - Pure Architectural Slate */}
      <div
        className={cn(
          'w-full max-w-lg mx-auto bg-[#0D111A] border-t border-[#1E2538] rounded-t-3xl shadow-2xl flex flex-col max-h-[74vh] sheet-surface overflow-hidden',
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        )}
      >
        {/* Drag Pill */}
        <div
          className="pt-2.5 pb-1 flex justify-center cursor-pointer group"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-[#28324C] group-hover:bg-[#3B486C] rounded-full transition-colors" />
        </div>

        {/* Clean, Non-AI Header */}
        <div className="px-5 py-3 border-b border-[#1A2132] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isUserCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 stroke-[2] shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 stroke-[2] shrink-0" />
            )}
            <div>
              <h3 className="text-[13px] font-semibold text-white tracking-tight">
                {isUserCorrect ? 'Correct Decision' : 'Distractor Analysis'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Clinical rule-out rationale
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#181F30] rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Explanations */}
        <div className="p-4 overflow-y-auto overscroll-contain space-y-2.5 flex-1">
          {options.map((optionText, optIdx) => {
            const isThisCorrect = optIdx === question.correctIndex
            const isThisSelected = optIdx === selectedIndex
            const explanationObj =
              explanations.find((e) => e.optionIndex === optIdx) ||
              (explanations[optIdx] ? explanations[optIdx] : null)

            const reasonText =
              explanationObj?.reason ||
              (isThisCorrect
                ? 'Standard first-line choice based on current clinical consensus and NBE keys.'
                : 'Distractor ruled out in this clinical vignette.')

            return (
              <div
                key={optIdx}
                className={cn(
                  'p-3.5 rounded-xl border transition-colors text-xs',
                  isThisCorrect
                    ? 'bg-emerald-950/20 border-emerald-700/35 text-zinc-200'
                    : isThisSelected
                    ? 'bg-rose-950/20 border-rose-700/35 text-zinc-200'
                    : 'bg-[#121624] border-[#1E263A] text-zinc-300'
                )}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border',
                        isThisCorrect
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-500'
                          : isThisSelected
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-[#192032] text-zinc-400 border-[#26324D]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs font-semibold text-white leading-snug break-words">
                      {optionText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 border',
                      isThisCorrect
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : isThisSelected
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-[#181F30] text-zinc-400 border-[#252E44]'
                    )}
                  >
                    {isThisCorrect ? '✓ Correct' : isThisSelected ? '✗ Selected' : 'Ruled Out'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="text-[12px] text-zinc-300 pl-7 leading-relaxed break-words font-normal">
                  {reasonText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions - High Contrast Solid CTA */}
        <div className="p-3.5 bg-[#0A0E16] border-t border-[#181E2E] flex items-center gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-medium bg-[#141A27] border border-[#232B40] text-zinc-300 hover:text-white hover:bg-[#1A2234] transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            Review Question
          </button>

          {onNextQuestion && (
            <button
              onClick={() => {
                onClose()
                onNextQuestion()
              }}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <span>{isLastQuestion ? 'Finish' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
