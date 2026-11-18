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
  if (!isOpen || !question) return null

  const isUserCorrect = selectedIndex === question.correctIndex
  const options = question.options || []
  const explanations = question.ruleOutExplanations || []
  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Surface (Apple Sheet) */}
      <div className="w-full max-w-lg mx-auto bg-white border-t border-slate-200 rounded-t-3xl shadow-sheet flex flex-col max-h-[85vh] animate-slide-up overflow-hidden">
        {/* Drag Handle */}
        <div className="w-9 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 cursor-grab" onClick={onClose} />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs',
                isUserCorrect
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              )}
            >
              {isUserCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                {isUserCorrect ? 'Correct Answer' : 'Incorrect Selection'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Clinical rationale for all 4 options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Explanations */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {options.map((optionText, optIdx) => {
            const isThisCorrect = optIdx === question.correctIndex
            const isThisSelected = optIdx === selectedIndex
            const explanationObj =
              explanations.find((e) => e.optionIndex === optIdx) ||
              (explanations[optIdx] ? explanations[optIdx] : null)

            const reasonText =
              explanationObj?.reason ||
              (isThisCorrect
                ? 'Standard first-line choice based on current clinical consensus.'
                : 'Distractor ruled out in this clinical scenario.')

            return (
              <div
                key={optIdx}
                className={cn(
                  'p-3.5 rounded-xl border transition-all text-xs',
                  isThisCorrect
                    ? 'bg-emerald-50/70 border-emerald-200/80 shadow-xs'
                    : isThisSelected
                    ? 'bg-rose-50/70 border-rose-200/80 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/70'
                )}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5',
                        isThisCorrect
                          ? 'bg-emerald-600 text-white'
                          : isThisSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs font-bold text-slate-900 leading-snug break-words">
                      {optionText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0',
                      isThisCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : isThisSelected
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200/60 text-slate-500'
                    )}
                  >
                    {isThisCorrect ? 'Correct' : isThisSelected ? 'Selected' : 'Distractor'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="text-[12px] text-slate-700 pl-7 leading-relaxed break-words font-medium">
                  {reasonText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            Review Question
          </button>

          {onNextQuestion && (
            <button
              onClick={() => {
                onClose()
                onNextQuestion()
              }}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
            >
              <span>{isLastQuestion ? 'Finish' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
