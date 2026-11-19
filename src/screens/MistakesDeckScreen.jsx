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
        <h1 className="text-[19px] font-bold tracking-tight text-[#053F5C]">
          Review Deck
        </h1>
        <span className="text-xs font-mono font-medium text-[#889DA8]">
          {deck.length} questions
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-5 h-5 border-2 border-[#C5E6F1] border-t-[#053F5C] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5C768D] font-medium">Loading review deck...</p>
        </div>
      ) : deck.length === 0 ? (
        <div className="py-20 text-center p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF9FC] text-[#053F5C] flex items-center justify-center mx-auto mb-2 border border-[#B8D5E3]">
            <CheckCircle2 className="w-5 h-5 stroke-[2] text-[#429EBD]" />
          </div>
          <h3 className="text-sm font-bold text-[#053F5C]">
            All caught up
          </h3>
          <p className="text-xs text-[#5C768D] max-w-xs mx-auto leading-relaxed">
            Questions you answer incorrectly during practice sessions will automatically appear here for focused spaced repetition.
          </p>
        </div>
      ) : currentCard ? (
        <div className="space-y-3">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs text-[#889DA8] px-0.5 font-medium">
            <span>
              Question {currentIndex + 1} of {deck.length}
            </span>
            <button
              onClick={() => onSelectTopic(currentCard.topicSlug)}
              className="text-xs font-semibold text-[#429EBD] hover:text-[#053F5C] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{currentCard.topicTitle}</span>
              <ArrowRight className="w-3 h-3 text-[#9FE7F5]" />
            </button>
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2F3F8] border border-[#C5E6F1] text-[#053F5C] font-mono">
                {currentCard.subject?.code || 'QUESTION'}
              </span>
              {currentCard.pyqTag && (
                <span className="text-[10px] font-mono text-[#8A5506] bg-[#FEF6E7] px-2 py-0.5 rounded border border-[#FDEBC8] font-bold">
                  {currentCard.pyqTag}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#053F5C] leading-relaxed">
              {currentCard.question}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {currentCard.options?.map((optionText, optIdx) => {
                const isChosen = currentSelected === optIdx
                const isCorrectOption = optIdx === currentCard.correctIndex

                let optionStyle =
                  'bg-[#F8FAFC] hover:bg-[#F1F9FB] border-[#E2E8F0] text-[#183B4E]'

                if (hasAnsweredCurrent) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-[#EDF9FC] border-[#429EBD] text-[#053F5C] font-semibold'
                  } else if (isChosen) {
                    optionStyle = 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B] font-semibold'
                  } else {
                    optionStyle = 'bg-[#F8FAFC]/60 border-[#E2E8F0] text-[#889DA8] opacity-60'
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
                          ? 'bg-[#429EBD] text-white border-[#429EBD]'
                          : hasAnsweredCurrent && isChosen
                          ? 'bg-[#DC2626] text-white border-[#DC2626]'
                          : 'bg-white text-[#5C768D] border-[#CBD5E1]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>

                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {optionText}
                    </span>

                    {hasAnsweredCurrent && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-[#429EBD] shrink-0 mt-0.5" />
                    )}
                    {hasAnsweredCurrent && isChosen && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Bottom Actions */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs font-semibold text-[#429EBD] hover:text-[#053F5C] hover:underline cursor-pointer"
                >
                  View 4-Option Explanation &rarr;
                </button>

                <button
                  onClick={handleNext}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#053F5C] hover:bg-[#032B40] text-white border border-[#084869] flex items-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
                >
                  <span>{currentIndex === deck.length - 1 ? 'Refresh' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#9FE7F5]" />
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
