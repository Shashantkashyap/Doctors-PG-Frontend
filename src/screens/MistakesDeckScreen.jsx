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
        <h1 className="text-[19px] font-serif font-bold tracking-tight text-[#161B18]">
          Review Deck
        </h1>
        <span className="text-xs font-mono font-medium text-[#7D8880]">
          {deck.length} questions
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-5 h-5 border-2 border-[#DCD6C9] border-t-[#1A3626] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5C6860] font-medium">Loading review deck...</p>
        </div>
      ) : deck.length === 0 ? (
        <div className="py-20 text-center p-6 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF5F0] text-[#1A472A] flex items-center justify-center mx-auto mb-2 border border-[#C6E2D0]">
            <CheckCircle2 className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="text-sm font-serif font-bold text-[#161B18]">
            All caught up
          </h3>
          <p className="text-xs text-[#5C6860] max-w-xs mx-auto leading-relaxed">
            Questions you answer incorrectly during practice sessions will automatically appear here for focused spaced repetition.
          </p>
        </div>
      ) : currentCard ? (
        <div className="space-y-3">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs text-[#7D8880] px-0.5 font-medium">
            <span>
              Question {currentIndex + 1} of {deck.length}
            </span>
            <button
              onClick={() => onSelectTopic(currentCard.topicSlug)}
              className="text-xs font-semibold text-[#2E5740] hover:text-[#162E22] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{currentCard.topicTitle}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F1F6F2] border border-[#D1E1D6] text-[#173926] font-mono">
                {currentCard.subject?.code || 'QUESTION'}
              </span>
              {currentCard.pyqTag && (
                <span className="text-[10px] font-mono text-[#5C6860] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EAE5DB]">
                  {currentCard.pyqTag}
                </span>
              )}
            </div>

            <p className="text-sm font-serif font-bold text-[#161B18] leading-relaxed">
              {currentCard.question}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-1">
              {currentCard.options?.map((optionText, optIdx) => {
                const isChosen = currentSelected === optIdx
                const isCorrectOption = optIdx === currentCard.correctIndex

                let optionStyle =
                  'bg-[#FAF8F5] hover:bg-[#F4EFE6] border-[#E5E0D5] text-[#202622]'

                if (hasAnsweredCurrent) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-[#EDF5F0] border-[#A8D3B7] text-[#143B23] font-semibold'
                  } else if (isChosen) {
                    optionStyle = 'bg-[#FAF0EE] border-[#E8B4AD] text-[#6E1F16] font-semibold'
                  } else {
                    optionStyle = 'bg-[#FAF8F5]/60 border-[#EAE5DB] text-[#8A958E] opacity-60'
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
                          ? 'bg-[#2E5740] text-[#FAF8F5] border-[#2E5740]'
                          : hasAnsweredCurrent && isChosen
                          ? 'bg-[#9C3D32] text-[#FAF8F5] border-[#9C3D32]'
                          : 'bg-[#FDFCF9] text-[#5C6860] border-[#DCD6C9]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>

                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1">
                      {optionText}
                    </span>

                    {hasAnsweredCurrent && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E5740] shrink-0 mt-0.5" />
                    )}
                    {hasAnsweredCurrent && isChosen && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-[#9C3D32] shrink-0 mt-0.5" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Bottom Actions */}
            {hasAnsweredCurrent && (
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#EAE5DB]">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs font-semibold text-[#2E5740] hover:text-[#162E22] hover:underline cursor-pointer"
                >
                  View 4-Option Explanation &rarr;
                </button>

                <button
                  onClick={handleNext}
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-[#1A3626] hover:bg-[#132B1E] text-[#FAF8F5] border border-[#234532] flex items-center gap-1 transition-colors active:scale-95 shadow-xs cursor-pointer"
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
