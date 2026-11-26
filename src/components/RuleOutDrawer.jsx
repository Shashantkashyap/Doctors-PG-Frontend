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

      {/* Drawer Surface - Buttery smooth GPU slide */}
      <div
        className={cn(
          'w-full max-w-lg mx-auto bg-obsidian-900 border-t border-obsidian-700/80 rounded-t-3xl shadow-2xl flex flex-col max-h-[74vh] sheet-surface overflow-hidden',
          isOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none'
        )}
      >
        {/* Drag / Dismiss Pill */}
        <div
          className="pt-2.5 pb-1 flex justify-center cursor-pointer group"
          onClick={onClose}
        >
          <div className="w-10 h-1 bg-obsidian-600 group-hover:bg-obsidian-500 rounded-full transition-colors" />
        </div>

        {/* Clean, Uncluttered Header */}
        <div className="px-5 py-2.5 border-b border-obsidian-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs shrink-0',
                isUserCorrect
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              )}
            >
              {isUserCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                {isUserCorrect ? 'Correct Decision' : 'Distractor Analysis'}
              </h3>
              <p className="text-[11px] text-obsidian-400">
                Clinical rule-out rationale
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-obsidian-400 hover:text-white hover:bg-obsidian-800 rounded-lg transition-colors cursor-pointer"
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
                  'p-3 rounded-xl border transition-colors text-xs',
                  isThisCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : isThisSelected
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                    : 'bg-obsidian-850 border-obsidian-700/80 text-obsidian-200'
                )}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border',
                        isThisCorrect
                          ? 'bg-emerald-500 text-obsidian-950 border-emerald-500'
                          : isThisSelected
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-obsidian-750 text-obsidian-400 border-obsidian-600'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs font-bold text-white leading-snug break-words">
                      {optionText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 border',
                      isThisCorrect
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold'
                        : isThisSelected
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold'
                        : 'bg-obsidian-800 text-obsidian-400 border-obsidian-700'
                    )}
                  >
                    {isThisCorrect ? '✓ Correct' : isThisSelected ? '✗ Selected' : 'Ruled Out'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="text-[12px] text-obsidian-300 pl-7 leading-relaxed break-words font-medium">
                  {reasonText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 bg-obsidian-850 border-t border-obsidian-700 flex items-center gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-obsidian-800 border border-obsidian-700 text-obsidian-200 hover:text-white hover:bg-obsidian-750 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            Review Question
          </button>

          {onNextQuestion && (
            <button
              onClick={() => {
                onClose()
                onNextQuestion()
              }}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
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
