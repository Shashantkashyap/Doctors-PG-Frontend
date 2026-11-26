import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Target,
  Sparkles,
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
    <div className="space-y-4 pb-24 animate-fade-in pt-1">
      {/* Header */}
      <div className="flex items-baseline justify-between px-0.5">
        <h1 className="text-lg font-bold tracking-tight text-white font-sans">
          Review Deck (Mistakes)
        </h1>
        <span className="text-xs font-mono font-bold text-obsidian-400">
          {deck.length} questions
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2.5">
          <div className="w-5 h-5 border-2 border-obsidian-700 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
          <p className="text-xs text-obsidian-400 font-medium">Loading review deck...</p>
        </div>
      ) : deck.length === 0 ? (
        <div className="py-20 text-center p-6 bg-obsidian-800 rounded-2xl border border-obsidian-700 shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/25">
            <CheckCircle2 className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-base font-bold text-white font-sans">
            All caught up!
          </h3>
          <p className="text-xs text-obsidian-400 max-w-xs mx-auto leading-relaxed">
            Questions you answer incorrectly during practice sessions will automatically appear here for focused spaced repetition.
          </p>
        </div>
      ) : currentCard ? (
        <div className="space-y-3">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs text-obsidian-400 px-0.5 font-medium">
            <span className="font-semibold text-white">
              Question {currentIndex + 1} of {deck.length}
            </span>
            <button
              onClick={() => onSelectTopic(currentCard.topicSlug)}
              className="text-xs font-semibold text-cliniq-pharm hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors truncate max-w-[200px]"
            >
              <span className="truncate">{currentCard.topicTitle}</span>
              <ArrowRight className="w-3 h-3 text-cliniq-pharm shrink-0" />
            </button>
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-800 border border-obsidian-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/25 text-sky-400 font-mono">
                {currentCard.subject?.code || 'QUESTION'}
              </span>
              {currentCard.pyqTag && (
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 font-bold">
                  {currentCard.pyqTag}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed font-sans">
              {currentCard.question}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {currentCard.options?.map((optionText, optIdx) => {
                const isChosen = currentSelected === optIdx
                const isCorrectOption = optIdx === currentCard.correctIndex

                let optionStyle =
                  'bg-obsidian-850 hover:bg-obsidian-750 border-obsidian-700 text-obsidian-200'

                if (hasAnsweredCurrent) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold ring-1 ring-emerald-500/30'
                  } else if (isChosen) {
                    optionStyle = 'bg-rose-500/15 border-rose-500/50 text-white font-semibold ring-1 ring-rose-500/30'
                  } else {
                    optionStyle = 'bg-obsidian-900/60 border-obsidian-750 text-obsidian-500 opacity-60'
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
                          ? 'bg-emerald-500 text-obsidian-950 font-bold border-emerald-500'
                          : hasAnsweredCurrent && isChosen
                          ? 'bg-rose-500 text-white font-bold border-rose-500'
                          : 'bg-obsidian-750 text-obsidian-400 border-obsidian-700'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>

                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 font-sans">
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

            {/* Bottom Actions */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-obsidian-700">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs font-semibold text-cliniq-pharm hover:text-sky-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View 4-Option Explanation &rarr;</span>
                </button>

                <button
                  onClick={handleNext}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-bold bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  <span>{currentIndex === deck.length - 1 ? 'Refresh' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
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
