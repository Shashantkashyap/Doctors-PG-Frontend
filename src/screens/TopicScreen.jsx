import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  Bookmark,
  Flag,
  CheckCircle2,
  Clock,
  ListChecks,
  Target,
} from 'lucide-react'
import WardCard from '../components/WardCard'
import Checklist from '../components/Checklist'
import McqDrill from '../components/McqDrill'
import FlagErrorDrawer from '../components/FlagErrorDrawer'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

export default function TopicScreen({ topicSlug, onBack, onAttemptDone }) {
  const [activeLayer, setActiveLayer] = useState(() => {
    if (typeof window !== 'undefined') {
      const layer = new URLSearchParams(window.location.search).get('layer')
      if (['wardCard', 'checklist', 'mcqDrill'].includes(layer)) return layer
    }
    return 'wardCard'
  })
  const [topic, setTopic] = useState(null)
  const [isPinned, setIsPinned] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFlagDrawerOpen, setIsFlagDrawerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('scroll') === 'true' && topic) {
      setTimeout(() => {
        window.scrollTo({ top: 500, behavior: 'instant' })
      }, 300)
    }
  }, [topic])

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
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-medium">Loading clinical card...</p>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-700">Topic not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-xs font-semibold rounded-xl text-white shadow-xs"
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

  return (
    <div className="space-y-4 animate-fade-in relative pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-float flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header: Remains pinned at top while scrolling */}
      <header className="sticky top-0 z-30 bg-[#F2F4F8] border-b border-slate-200/90 -mx-4 px-4 pt-2.5 pb-2.5 space-y-2 shadow-xs transition-all">
        {/* Top Action Row: Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 py-1 px-2 -ml-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-200/60 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            <span>Explore</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 uppercase tracking-wider">
              {topic.subject?.name || 'Medical'}
            </span>

            <button
              onClick={handleTogglePin}
              title={isPinned ? 'Remove from Notebook' : 'Save to Notebook'}
              className={cn(
                'w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-95 shadow-xs',
                isPinned
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-200/80 hover:text-slate-800'
              )}
            >
              <Bookmark className={cn('w-3.5 h-3.5', isPinned && 'fill-amber-500 text-amber-500')} />
            </button>

            <button
              onClick={() => setIsFlagDrawerOpen(true)}
              title="Flag Discrepancy"
              className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-95"
            >
              <Flag className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Topic Title */}
        <div className="px-0.5">
          <h1 className="text-base sm:text-lg font-bold font-outfit text-slate-900 tracking-tight leading-snug line-clamp-1">
            {topic.title}
          </h1>
        </div>

        {/* 3-Layer Segmented Switcher (Apple iOS segmented slider) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => handleLayerSwitch('wardCard')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation',
              activeLayer === 'wardCard'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Clinical Card
          </button>

          <button
            onClick={() => handleLayerSwitch('checklist')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation',
              activeLayer === 'checklist'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            5m Checklist
          </button>

          <button
            onClick={() => handleLayerSwitch('mcqDrill')}
            className={cn(
              'py-1.5 px-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center touch-manipulation',
              activeLayer === 'mcqDrill'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            10 MCQs
          </button>
        </div>
      </header>

      {/* Active Layer View */}
      <div className="pt-1">
        {activeLayer === 'wardCard' && <WardCard topic={topic} />}
        {activeLayer === 'checklist' && <Checklist checklist={topic.completeChecklist} />}
        {activeLayer === 'mcqDrill' && (
          <McqDrill
            topic={topic}
            topicSlug={topicSlug}
            onAttemptDone={onAttemptDone}
          />
        )}
      </div>

      {/* Flag Drawer */}
      <FlagErrorDrawer
        isOpen={isFlagDrawerOpen}
        onClose={() => setIsFlagDrawerOpen(false)}
        topic={topic}
      />
    </div>
  )
}
