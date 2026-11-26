import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  Bookmark,
  Flag,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  Target,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import WardCard from '../components/WardCard'
import Checklist from '../components/Checklist'
import McqDrill from '../components/McqDrill'
import FlagErrorDrawer from '../components/FlagErrorDrawer'
import AnimatedDoctorGuide from '../components/AnimatedDoctorGuide'
import GuidelinesSheet from '../components/GuidelinesSheet'
import ErrorBoundary from '../components/ErrorBoundary'
import { apiService } from '../api/client'
import { resolveTopicGuidelines } from '../utils/guidelinesResolver'
import { cn } from '../utils/cn'

export default function TopicScreen({ topicSlug, onBack, onAttemptDone, initialLayer = 'wardCard' }) {
  const [activeLayer, setActiveLayer] = useState(() => {
    if (initialLayer && ['wardCard', 'checklist', 'mcqDrill'].includes(initialLayer)) {
      return initialLayer
    }
    if (typeof window !== 'undefined') {
      const layer = new URLSearchParams(window.location.search).get('layer')
      if (['wardCard', 'checklist', 'mcqDrill'].includes(layer)) return layer
    }
    return 'wardCard'
  })

  useEffect(() => {
    if (initialLayer && ['wardCard', 'checklist', 'mcqDrill'].includes(initialLayer)) {
      setActiveLayer(initialLayer)
    }
  }, [initialLayer, topicSlug])
  const [topic, setTopic] = useState(null)
  const [isPinned, setIsPinned] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFlagDrawerOpen, setIsFlagDrawerOpen] = useState(false)
  const [isGuidelinesSheetOpen, setIsGuidelinesSheetOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    apiService
      .getTopic(topicSlug)
      .then((data) => {
        if (mounted && data?.topic) {
          setTopic(data.topic)
          setIsPinned(Boolean(data.userState?.isPinnedInNotebook))
        }
      })
      .catch((err) => {
        console.error('Topic fetch error:', err)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [topicSlug])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 1800)
  }

  const handleTogglePin = async () => {
    if (!topic?.id) return
    const nextState = !isPinned
    setIsPinned(nextState)

    try {
      const res = await apiService.toggleNotebook(topic.id)
      if (res?.bookmarked) {
        showToast('Saved to Notebook')
      } else {
        showToast('Removed from Notebook')
      }
    } catch (err) {
      console.error('Toggle notebook error:', err)
      setIsPinned(!nextState)
      showToast('Could not update notebook')
    }
  }

  if (isLoading) {
    return (
      <div className="py-28 text-center space-y-2.5">
        <div className="w-5 h-5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
        <p className="text-xs text-obsidian-400 font-medium">Loading clinical capsule...</p>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-obsidian-300">Topic not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          &larr; Return to Explore
        </button>
      </div>
    )
  }

  const handleLayerSwitch = (layer) => {
    setActiveLayer(layer)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // Subject theme styling
  const subjectCode = topic.subject?.code || 'PHARM'
  const subjectAccentClass =
    subjectCode === 'PHARM'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
      : subjectCode === 'PATH'
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'

  // Tier 3 Guidelines & Controversy Alert data (guaranteed authoritative guidelines & exam controversy resolver)
  const guidelines = resolveTopicGuidelines(topic, topicSlug)

  return (
    <div className="space-y-3.5 animate-fade-in relative pb-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-obsidian-800 text-white border border-obsidian-600 text-xs font-semibold shadow-float flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cliniq-psm" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-obsidian-900/95 backdrop-blur-xl border-b border-obsidian-700/80 -mx-4 px-4 pt-2 pb-2.5 space-y-2 shadow-xs transition-all">
        {/* Top Action Row: Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 py-1 px-2 -ml-1 rounded-xl text-xs font-semibold text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            <span>Explore</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border',
                subjectAccentClass
              )}
            >
              {topic.subject?.name || 'Medical'}
            </span>

            <button
              onClick={handleTogglePin}
              title={isPinned ? 'Remove from Notebook' : 'Save to Notebook'}
              className={cn(
                'w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer',
                isPinned
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-obsidian-800 text-obsidian-400 border-obsidian-700 hover:text-white'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isPinned && 'fill-amber-400 text-amber-400')} />
            </button>

            <button
              onClick={() => setIsFlagDrawerOpen(true)}
              title="Flag Discrepancy"
              className="w-8 h-8 rounded-xl bg-obsidian-800 border border-obsidian-700 shadow-xs flex items-center justify-center text-obsidian-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Topic Title */}
        <div className="px-0.5">
          <h1 className="text-base sm:text-lg font-bold font-sans text-white tracking-tight leading-snug line-clamp-1">
            {topic.title}
          </h1>
        </div>

        {/* 3-Mode Segmented Floating Toggle */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-obsidian-800/90 rounded-xl border border-obsidian-700/80">
          <button
            onClick={() => handleLayerSwitch('wardCard')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation cursor-pointer flex items-center justify-center gap-1',
              activeLayer === 'wardCard'
                ? 'bg-obsidian-700 text-white shadow-xs font-bold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-white'
            )}
          >
            <Zap className="w-3.5 h-3.5 text-cliniq-trap" />
            <span>3-Min Rapid</span>
          </button>

          <button
            onClick={() => handleLayerSwitch('checklist')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation cursor-pointer flex items-center justify-center gap-1',
              activeLayer === 'checklist'
                ? 'bg-obsidian-700 text-white shadow-xs font-bold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-white'
            )}
          >
            <BookOpen className="w-3.5 h-3.5 text-cliniq-pharm" />
            <span>10-Min Deep</span>
          </button>

          <button
            onClick={() => handleLayerSwitch('mcqDrill')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation cursor-pointer flex items-center justify-center gap-1',
              activeLayer === 'mcqDrill'
                ? 'bg-obsidian-700 text-white shadow-xs font-bold border border-obsidian-600'
                : 'text-obsidian-400 hover:text-white'
            )}
          >
            <Target className="w-3.5 h-3.5 text-cliniq-psm" />
            <span>10 MCQs</span>
          </button>
        </div>
      </header>

      {/* Active Layer View */}
      <div className="pt-0.5">
        <ErrorBoundary>
          {activeLayer === 'wardCard' && <WardCard topic={topic} />}
          {activeLayer === 'checklist' && <Checklist checklist={topic.completeChecklist} />}
          {activeLayer === 'mcqDrill' && (
            <McqDrill
              topic={topic}
              topicSlug={topicSlug}
              onAttemptDone={onAttemptDone}
            />
          )}
        </ErrorBoundary>
      </div>

      {/* Floating Clinical Doctor Guide (Permanently Fixed to Viewport Right Corner like Chatbot) */}
      <div className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none select-none">
        <div className="w-full max-w-[430px] mx-auto px-4 relative flex justify-end">
          <button
            type="button"
            onClick={() => setIsGuidelinesSheetOpen(true)}
            className="pointer-events-auto relative flex items-center justify-center w-14 h-16 rounded-2xl bg-[#0D1220]/95 hover:bg-[#141C30] backdrop-blur-md border border-[#222E48] hover:border-amber-500/60 shadow-[0_10px_35px_rgba(0,0,0,0.7)] hover:shadow-amber-500/15 transition-all duration-200 cursor-pointer active:scale-90 group"
            title="Clinical Guidelines & Controversy Sheet"
            aria-label="Open Clinical Guidelines"
          >
            {/* Live amber controversy indicator dot at top-right */}
            {guidelines?.examControversyAlert && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex items-center justify-center rounded-full h-3.5 w-3.5 bg-amber-500 text-[8.5px] font-bold text-obsidian-950 border border-obsidian-900 shadow-sm">
                  ⚡
                </span>
              </span>
            )}

            {/* Animated Doctor Character */}
            <div className="w-12 h-14 pointer-events-none">
              <AnimatedDoctorGuide
                className="w-full h-full"
                hasAlert={Boolean(guidelines?.examControversyAlert)}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Guidelines Bottom Sheet */}
      <GuidelinesSheet
        isOpen={isGuidelinesSheetOpen}
        onClose={() => setIsGuidelinesSheetOpen(false)}
        guidelines={guidelines}
        topicTitle={topic.title}
        subjectCode={topic.subject?.code || 'PHARM'}
        onStartMcqs={() => handleLayerSwitch('mcqDrill')}
      />

      {/* Flag Drawer */}
      <FlagErrorDrawer
        isOpen={isFlagDrawerOpen}
        onClose={() => setIsFlagDrawerOpen(false)}
        topic={topic}
      />
    </div>
  )
}
