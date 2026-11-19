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
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#053F5C]/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Surface */}
      <div className="w-full max-w-lg mx-auto bg-white border-t border-[#E2E8F0] rounded-t-3xl shadow-sheet flex flex-col max-h-[85vh] animate-slide-up overflow-hidden">
        {/* Drag Handle */}
        <div className="w-9 h-1 bg-[#CBD5E1] rounded-full mx-auto mt-2.5 mb-1 cursor-grab" onClick={onClose} />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs',
                isUserCorrect
                  ? 'bg-[#EDF9FC] text-[#053F5C]'
                  : 'bg-[#FEF2F2] text-[#991B1B]'
              )}
            >
              {isUserCorrect ? <CheckCircle2 className="w-4 h-4 text-[#429EBD]" /> : <XCircle className="w-4 h-4 text-[#DC2626]" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#053F5C]">
                {isUserCorrect ? 'Correct Answer' : 'Incorrect Selection'}
              </h3>
              <p className="text-[11px] text-[#5C768D]">
                Clinical rationale for all 4 options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#5C768D] hover:text-[#053F5C] rounded-full transition-colors cursor-pointer"
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
                    ? 'bg-[#EDF9FC] border-[#429EBD] text-[#053F5C] shadow-xs'
                    : isThisSelected
                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                )}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5',
                        isThisCorrect
                          ? 'bg-[#429EBD] text-white'
                          : isThisSelected
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-white text-[#5C768D] border border-[#CBD5E1]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs font-bold text-[#053F5C] leading-snug break-words">
                      {optionText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0',
                      isThisCorrect
                        ? 'bg-[#E2F3F8] text-[#053F5C] border border-[#C5E6F1]'
                        : isThisSelected
                        ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                        : 'bg-[#F0F6F9] text-[#5C768D]'
                    )}
                  >
                    {isThisCorrect ? 'Correct' : isThisSelected ? 'Selected' : 'Distractor'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="text-[12px] text-[#183B4E] pl-7 leading-relaxed break-words font-medium">
                  {reasonText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-white border border-[#E2E8F0] text-[#053F5C] hover:bg-[#F0F6F9] transition-colors shadow-xs cursor-pointer"
          >
            Review Question
          </button>

          {onNextQuestion && (
            <button
              onClick={() => {
                onClose()
                onNextQuestion()
              }}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-[#053F5C] hover:bg-[#032B40] text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs border border-[#084869] cursor-pointer"
            >
              <span>{isLastQuestion ? 'Finish' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9FE7F5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
