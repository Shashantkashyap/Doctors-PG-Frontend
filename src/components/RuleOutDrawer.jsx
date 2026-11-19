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
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#161B18]/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Surface */}
      <div className="w-full max-w-lg mx-auto bg-[#FDFCF9] border-t border-[#E5E0D5] rounded-t-3xl shadow-sheet flex flex-col max-h-[85vh] animate-slide-up overflow-hidden">
        {/* Drag Handle */}
        <div className="w-9 h-1 bg-[#D5CFBF] rounded-full mx-auto mt-2.5 mb-1 cursor-grab" onClick={onClose} />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#EAE5DB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-lg font-bold text-xs',
                isUserCorrect
                  ? 'bg-[#EDF5F0] text-[#1A472A]'
                  : 'bg-[#FAF0EE] text-[#78261C]'
              )}
            >
              {isUserCorrect ? <CheckCircle2 className="w-4 h-4 text-[#2E7D47]" /> : <XCircle className="w-4 h-4 text-[#A53425]" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#161B18]">
                {isUserCorrect ? 'Correct Answer' : 'Incorrect Selection'}
              </h3>
              <p className="text-[11px] text-[#717E75]">
                Clinical rationale for all 4 options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#87928A] hover:text-[#161B18] rounded-full transition-colors"
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
                    ? 'bg-[#EDF5F0] border-[#B8DCB3] text-[#123620] shadow-xs'
                    : isThisSelected
                    ? 'bg-[#FAF0EE] border-[#E8C8C1] text-[#591B14] shadow-xs'
                    : 'bg-[#FAF8F5] border-[#E5E0D5]'
                )}
              >
                {/* Option Header */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5',
                        isThisCorrect
                          ? 'bg-[#1A472A] text-white'
                          : isThisSelected
                          ? 'bg-[#8C2B20] text-white'
                          : 'bg-[#FDFCF9] text-[#5C6860] border border-[#D5CFBF]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs font-bold text-[#161B18] leading-snug break-words">
                      {optionText}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0',
                      isThisCorrect
                        ? 'bg-[#E2ECE5] text-[#1A3626]'
                        : isThisSelected
                        ? 'bg-[#FAF0EE] text-[#78261C]'
                        : 'bg-[#F2EFE8] text-[#5C6860]'
                    )}
                  >
                    {isThisCorrect ? 'Correct' : isThisSelected ? 'Selected' : 'Distractor'}
                  </span>
                </div>

                {/* Clinical Rationale */}
                <div className="text-[12px] text-[#202622] pl-7 leading-relaxed break-words font-medium">
                  {reasonText}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 bg-[#F8F6F0] border-t border-[#EAE5DB] flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-[#FDFCF9] border border-[#E5E0D5] text-[#2F3731] hover:bg-[#F4F0E8] transition-colors shadow-xs"
          >
            Review Question
          </button>

          {onNextQuestion && (
            <button
              onClick={() => {
                onClose()
                onNextQuestion()
              }}
              className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold bg-[#1A3626] hover:bg-[#132B1E] text-[#FAF8F5] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs border border-[#234532]"
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
