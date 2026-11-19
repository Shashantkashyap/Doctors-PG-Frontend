import React, { useState, useEffect, useRef } from 'react'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { apiService } from '../api/client'
import RuleOutDrawer from './RuleOutDrawer'
import { cn } from '../utils/cn'

export default function McqDrill({ topic, topicSlug, onAttemptDone }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  const questionStartTimeRef = useRef(Date.now())

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    apiService
      .getTopicQuestions(topicSlug)
      .then((data) => {
        if (mounted && data?.questions) {
          setQuestions(data.questions)
        }
      })
      .catch((err) => {
        console.error('Error fetching questions:', err)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [topicSlug])

  useEffect(() => {
    questionStartTimeRef.current = Date.now()
  }, [currentIndex])

  const handleSelectOption = async (optionIdx) => {
    if (selectedAnswers[currentIndex] !== undefined) {
      setIsDrawerOpen(true)
      return
    }

    const currentQ = questions[currentIndex]
    if (!currentQ) return

    const isCorrect = optionIdx === currentQ.correctIndex
    const timeSpentMs = Math.max(1000, Date.now() - questionStartTimeRef.current)

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }))

    setIsDrawerOpen(true)

    try {
      await apiService.recordAttempt({
        topicId: topic?.id,
        mcqIndex: currentIndex,
        selectedOptionIndex: optionIdx,
        isCorrect,
        timeSpentMs,
      })
      if (onAttemptDone) onAttemptDone()
    } catch (err) {
      console.warn('Telemetry post failed:', err)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsDrawerOpen(false)
    } else {
      setIsCompleted(true)
      setIsDrawerOpen(false)
    }
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setCurrentIndex(0)
    setIsCompleted(false)
    setIsDrawerOpen(false)
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-2.5">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading practice drill...</p>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400 space-y-2">
        <p className="text-xs">No questions recorded for this topic yet.</p>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const currentSelected = selectedAnswers[currentIndex]
  const hasAnsweredCurrent = currentSelected !== undefined

  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => questions[parseInt(qIdx)]?.correctIndex === optIdx
  ).length

  if (isCompleted) {
    const accuracy = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="p-6 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] text-center space-y-5 shadow-xs my-2 animate-fade-in">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#717E75]">
            Session Summary
          </span>
          <h3 className="text-xl font-bold text-[#161B18] mt-1">
            {correctCount} / {questions.length} Correct
          </h3>
          <p className="text-xs text-[#5C6860] mt-0.5">
            Accuracy: {accuracy}%
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto py-1">
          {questions.map((q, idx) => {
            const chosen = selectedAnswers[idx]
            const isQCorrect = chosen === q.correctIndex
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx)
                  setIsCompleted(false)
                  setIsDrawerOpen(true)
                }}
                className={cn(
                  'h-8 rounded-lg font-mono text-xs font-semibold border flex items-center justify-center transition-all',
                  chosen === undefined
                    ? 'bg-[#F4F0E8] text-[#87928A] border-[#E5E0D5]'
                    : isQCorrect
                    ? 'bg-[#EDF5F0] text-[#1A472A] border-[#B8DCB3]'
                    : 'bg-[#FAF0EE] text-[#78261C] border-[#E8C8C1]'
                )}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1A3626] hover:bg-[#132B1E] text-[#FAF8F5] flex items-center justify-center gap-1.5 transition-all shadow-xs border border-[#234532]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Again</span>
        </button>
      </div>
    )
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="space-y-3.5 pb-20 animate-fade-in">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-xs text-[#5C6860] px-0.5 font-medium">
        <span className="font-semibold text-[#161B18]">
          Question {currentIndex + 1} of {questions.length}
        </span>

        {currentQ.pyqTag && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F2EFE8] border border-[#E5E0D5] text-[#434D46] font-semibold">
            {currentQ.pyqTag}
          </span>
        )}
      </div>

      {/* Segmented Progress Track */}
      <div className="flex items-center gap-1">
        {questions.map((_, i) => {
          const ans = selectedAnswers[i]
          const isDone = ans !== undefined
          const isQCorrect = isDone && ans === questions[i].correctIndex
          const isCurrent = i === currentIndex

          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-150',
                isCurrent && 'ring-2 ring-[#1A3626]/30',
                !isDone && 'bg-[#EAE5DB]',
                isDone && isQCorrect && 'bg-[#2E7D47]',
                isDone && !isQCorrect && 'bg-[#A53425]'
              )}
            />
          )
        })}
      </div>

      {/* Question Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] shadow-xs space-y-4">
        {/* Question Stem */}
        <p className="text-sm font-semibold text-[#161B18] leading-relaxed break-words">
          {currentQ.question}
        </p>

        {/* 4 Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options?.map((optionText, optIdx) => {
            const isChosen = currentSelected === optIdx
            const isCorrectOption = optIdx === currentQ.correctIndex

            let optionStyle =
              'bg-[#FAF8F5] hover:bg-[#F4F0E8] border-[#E5E0D5] text-[#202622]'

            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'bg-[#EDF5F0] border-[#97CBA4] text-[#123620] font-semibold shadow-xs'
              } else if (isChosen) {
                optionStyle = 'bg-[#FAF0EE] border-[#DE9E95] text-[#591B14] font-semibold shadow-xs'
              } else {
                optionStyle = 'bg-[#FAF8F5]/60 border-[#EAE5DB] text-[#87928A] opacity-60'
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={cn(
                  'w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 active:scale-[0.99] touch-manipulation',
                  optionStyle
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border',
                    hasAnsweredCurrent && isCorrectOption
                      ? 'bg-[#1A472A] text-white border-[#1A472A]'
                      : hasAnsweredCurrent && isChosen
                      ? 'bg-[#8C2B20] text-white border-[#8C2B20]'
                      : 'bg-[#FDFCF9] text-[#5C6860] border-[#D5CFBF]'
                  )}
                >
                  {optionLetters[optIdx]}
                </span>

                <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 min-w-0 break-words">
                  {optionText}
                </span>

                {hasAnsweredCurrent && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D47] shrink-0 mt-0.5" />
                )}
                {hasAnsweredCurrent && isChosen && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-[#A53425] shrink-0 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* View Rule Out Drawer trigger */}
        {hasAnsweredCurrent && (
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#EAE5DB]">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-xs font-semibold text-[#1A3626] hover:underline"
            >
              View 4-Option Explanation &rarr;
            </button>

            <button
              onClick={handleNextQuestion}
              className="py-1.5 px-3 rounded-xl bg-[#1A3626] hover:bg-[#132B1E] text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-xs border border-[#234532]"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next' : 'Finish'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4-Option Rule Out Drawer */}
      <RuleOutDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        question={currentQ}
        selectedIndex={currentSelected}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentIndex === questions.length - 1}
      />
    </div>
  )
}
