import React, { useState, useEffect, useRef } from 'react'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react'
import { apiService } from '../api/client'
import { analyticsStore } from '../utils/analyticsStore'
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
  const drawerTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    }
  }, [])

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
    if (drawerTimerRef.current) {
      clearTimeout(drawerTimerRef.current)
      drawerTimerRef.current = null
    }

    if (selectedAnswers[currentIndex] !== undefined) {
      setIsDrawerOpen(true)
      return
    }

    const currentQ = questions[currentIndex]
    if (!currentQ) return

    const isCorrect = optionIdx === currentQ.correctIndex
    const timeSpentMs = Math.max(1000, Date.now() - questionStartTimeRef.current)

    // Highlight immediately
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }))

    setIsDrawerOpen(true)

    try {
      analyticsStore.recordAttempt({
        topicId: topic?.id || topic?._id,
        topicSlug: topicSlug,
        topicTitle: topic?.title,
        subjectCode: topic?.subject?.code || 'PHARM',
        isCorrect,
      })
    } catch (e) {
      console.warn('Local analytics store error:', e)
    }

    try {
      await apiService.recordAttempt({
        topicId: topic?.id || topic?._id || topicSlug,
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
    if (drawerTimerRef.current) {
      clearTimeout(drawerTimerRef.current)
      drawerTimerRef.current = null
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsDrawerOpen(false)
    } else {
      setIsCompleted(true)
      setIsDrawerOpen(false)
    }
  }

  const handleRestart = () => {
    if (drawerTimerRef.current) {
      clearTimeout(drawerTimerRef.current)
      drawerTimerRef.current = null
    }
    setSelectedAnswers({})
    setCurrentIndex(0)
    setIsCompleted(false)
    setIsDrawerOpen(false)
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-2.5">
        <div className="w-5 h-5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
        <p className="text-xs text-obsidian-400 font-medium">Loading 10 clinical vignette MCQs...</p>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="py-16 text-center text-obsidian-400 space-y-2">
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
      <div className="p-6 rounded-2xl bg-obsidian-800 border border-obsidian-700 text-center space-y-5 shadow-xs my-2 animate-fade-in">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-obsidian-400">
            Session Performance
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">
            {correctCount} / {questions.length} Correct
          </h3>
          <p className="text-xs text-obsidian-400 mt-0.5">
            Accuracy: <span className="text-cliniq-psm font-bold">{accuracy}%</span>
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
                  'h-8 rounded-lg font-mono text-xs font-semibold border flex items-center justify-center transition-all cursor-pointer',
                  chosen === undefined
                    ? 'bg-obsidian-850 text-obsidian-400 border-obsidian-700'
                    : isQCorrect
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                )}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Practice Drill Again</span>
        </button>
      </div>
    )
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="space-y-3.5 pb-20 animate-fade-in">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-xs text-obsidian-400 px-0.5 font-medium">
        <span className="font-semibold text-white">
          Question {currentIndex + 1} of {questions.length}
        </span>

        {currentQ.pyqTag && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-bold">
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
                'h-1.5 flex-1 rounded-full transition-all duration-150 cursor-pointer',
                isCurrent && 'ring-2 ring-cliniq-pharm/50',
                !isDone && 'bg-obsidian-700',
                isDone && isQCorrect && 'bg-cliniq-psm',
                isDone && !isQCorrect && 'bg-cliniq-danger'
              )}
            />
          )
        })}
      </div>

      {/* Question Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-800 border border-obsidian-700 shadow-xs space-y-4">
        {/* Question Stem */}
        <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed break-words">
          {currentQ.question}
        </p>

        {/* 4 Options */}
        <div className="space-y-2 pt-1">
          {currentQ.options?.map((optionText, optIdx) => {
            const isChosen = currentSelected === optIdx
            const isCorrectOption = optIdx === currentQ.correctIndex

            let optionStyle =
              'bg-obsidian-850 hover:bg-obsidian-750 border-obsidian-700 text-obsidian-200'

            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-500/10 border-emerald-500 text-white font-semibold'
              } else if (isChosen) {
                optionStyle = 'bg-rose-500/10 border-rose-500 text-white font-semibold'
              } else {
                optionStyle = 'bg-obsidian-850/50 border-obsidian-700/60 text-obsidian-400 opacity-60'
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={cn(
                  'w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all duration-150 active:scale-[0.99] touch-manipulation cursor-pointer',
                  optionStyle
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border',
                    hasAnsweredCurrent && isCorrectOption
                      ? 'bg-emerald-500 text-obsidian-950 border-emerald-500'
                      : hasAnsweredCurrent && isChosen
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-obsidian-750 text-obsidian-400 border-obsidian-600'
                  )}
                >
                  {optionLetters[optIdx]}
                </span>

                <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 min-w-0 break-words">
                  {optionText}
                </span>

                {hasAnsweredCurrent && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnsweredCurrent && isChosen && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* View Rule Out Drawer trigger */}
        {hasAnsweredCurrent && (
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-obsidian-700">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-xs font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors"
            >
              View 4-Option Rule-Out &rarr;
            </button>

            <button
              onClick={handleNextQuestion}
              className="py-1.5 px-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next' : 'Finish'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
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
