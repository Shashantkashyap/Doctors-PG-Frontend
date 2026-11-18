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
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center space-y-5 shadow-card my-2 animate-fade-in">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Session Summary
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {correctCount} / {questions.length} Correct
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
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
                    ? 'bg-slate-50 text-slate-400 border-slate-200'
                    : isQCorrect
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                )}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
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
      <div className="flex items-center justify-between text-xs text-slate-500 px-0.5 font-medium">
        <span className="font-semibold text-slate-700">
          Question {currentIndex + 1} of {questions.length}
        </span>

        {currentQ.pyqTag && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
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
                'h-1 flex-1 rounded-full transition-all duration-150',
                isCurrent && 'ring-2 ring-slate-900/30',
                !isDone && 'bg-slate-200',
                isDone && isQCorrect && 'bg-emerald-500',
                isDone && !isQCorrect && 'bg-rose-500'
              )}
            />
          )
        })}
      </div>

      {/* Question Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
        {/* Question Stem */}
        <p className="text-sm font-semibold text-slate-900 leading-relaxed break-words">
          {currentQ.question}
        </p>

        {/* 4 Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options?.map((optionText, optIdx) => {
            const isChosen = currentSelected === optIdx
            const isCorrectOption = optIdx === currentQ.correctIndex

            let optionStyle =
              'bg-slate-50 hover:bg-slate-100/70 border-slate-200/80 text-slate-800'

            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
              } else if (isChosen) {
                optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold shadow-xs'
              } else {
                optionStyle = 'bg-slate-50/50 border-slate-200/60 text-slate-400 opacity-60'
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
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : hasAnsweredCurrent && isChosen
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  )}
                >
                  {optionLetters[optIdx]}
                </span>

                <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 min-w-0 break-words">
                  {optionText}
                </span>

                {hasAnsweredCurrent && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasAnsweredCurrent && isChosen && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* View Rule Out Drawer trigger */}
        {hasAnsweredCurrent && (
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-xs font-semibold text-slate-900 hover:underline"
            >
              View 4-Option Explanation &rarr;
            </button>

            <button
              onClick={handleNextQuestion}
              className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 transition-colors active:scale-95 shadow-xs"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
