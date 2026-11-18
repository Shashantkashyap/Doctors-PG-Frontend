import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
} from 'lucide-react'
import { apiService } from '../api/client'
import RuleOutDrawer from '../components/RuleOutDrawer'
import { cn } from '../utils/cn'

export default function MistakesDeckScreen({ onSelectTopic, onUpdateCounts }) {
  const [deck, setDeck] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWrongDeck = () => {
    setIsLoading(true)
    apiService
      .getWrongDeck()
      .then((data) => {
        if (data?.deck) {
          setDeck(data.deck)
          if (onUpdateCounts) onUpdateCounts(data.deck.length)
        }
      })
      .catch((err) => console.error('Wrong deck fetch error:', err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchWrongDeck()
  }, [])

  const currentCard = deck[currentIndex]
  const currentSelected = selectedAnswers[currentIndex]
  const hasAnsweredCurrent = currentSelected !== undefined

  const handleSelectOption = async (optionIdx) => {
    if (!currentCard) return

    if (hasAnsweredCurrent) {
      setIsDrawerOpen(true)
      return
    }

    const isCorrect = optionIdx === currentCard.correctIndex

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }))

    setIsDrawerOpen(true)

    try {
      await apiService.recordAttempt({
        topicId: currentCard.topicId,
        mcqIndex: currentCard.mcqIndex,
        selectedOptionIndex: optionIdx,
        isCorrect,
        timeSpentMs: 10000,
      })
    } catch (err) {
      console.warn('Telemetry error:', err)
    }
  }

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsDrawerOpen(false)
    } else {
      fetchWrongDeck()
      setCurrentIndex(0)
      setSelectedAnswers({})
      setIsDrawerOpen(false)
    }
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="space-y-4 pb-16 animate-fade-in pt-3">
      {/* Header */}
      <div className="flex items-baseline justify-between px-0.5">
        <h1 className="text-[18px] font-bold font-outfit tracking-tight text-slate-900">
          Review Deck
        </h1>
        <span className="text-xs font-mono font-medium text-slate-400">
          {deck.length} questions
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading review deck...</p>
        </div>
      ) : deck.length === 0 ? (
        <div className="py-20 text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            All caught up
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Questions you answer incorrectly during practice sessions will automatically appear here for focused spaced repetition.
          </p>
        </div>
      ) : currentCard ? (
        <div className="space-y-3">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-0.5 font-medium">
            <span>
              Question {currentIndex + 1} of {deck.length}
            </span>
            <button
              onClick={() => onSelectTopic(currentCard.topicSlug)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <span>{currentCard.topicTitle}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                {currentCard.subject?.code || 'QUESTION'}
              </span>
              {currentCard.pyqTag && (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {currentCard.pyqTag}
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {currentCard.question}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {currentCard.options?.map((optionText, optIdx) => {
                const isChosen = currentSelected === optIdx
                const isCorrectOption = optIdx === currentCard.correctIndex

                let optionStyle =
                  'bg-slate-50 hover:bg-slate-100/70 border-slate-200/80 text-slate-800'

                if (hasAnsweredCurrent) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                  } else if (isChosen) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold'
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

                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
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

            {/* Bottom Actions */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  View 4-Option Explanation &rarr;
                </button>

                <button
                  onClick={handleNext}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 transition-colors active:scale-95 shadow-xs"
                >
                  <span>{currentIndex === deck.length - 1 ? 'Refresh' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Rule Out Drawer */}
          <RuleOutDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            question={currentCard}
            selectedIndex={currentSelected}
            onNextQuestion={handleNext}
            isLastQuestion={currentIndex === deck.length - 1}
          />
        </div>
      ) : null}
    </div>
  )
}
