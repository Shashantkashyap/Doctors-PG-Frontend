import React, { useState, useEffect } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react'
import LockedSubjectModal from '../components/LockedSubjectModal'
import TopNavbar from '../components/TopNavbar'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'
const ITEMS_PER_PAGE = 8

export default function ExploreScreen({ onSelectTopic, onOpenSearch, onOpenProfile }) {
  const [subjects, setSubjects] = useState([
    { id: 'pharm', name: 'Pharmacology', slug: 'pharmacology', isLocked: false },
    { id: 'path', name: 'Pathology', slug: 'pathology', isLocked: false },
    { id: 'psm', name: 'PSM', slug: 'psm', isLocked: false },
  ])
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('pharmacology')
  const [subjectTopics, setSubjectTopics] = useState([])
  const [trending, setTrending] = useState([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [lockedModalSubject, setLockedModalSubject] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let mounted = true
    apiService
      .getSubjects()
      .then((data) => {
        if (mounted && data?.subjects) {
          setSubjects(data.subjects)
        }
      })
      .catch((err) => console.error('Subjects fetch error:', err))

    apiService
      .getTrending()
      .then((data) => {
        if (mounted && data?.topics) {
          setTrending(data.topics)
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedSubjectSlug) return

    let mounted = true
    setIsLoadingTopics(true)
    apiService
      .getSubjectTopics(selectedSubjectSlug)
      .then((data) => {
        if (mounted && data?.topics) {
          setSubjectTopics(data.topics)
        }
      })
      .catch((err) => console.error('Topics fetch error:', err))
      .finally(() => {
        if (mounted) setIsLoadingTopics(false)
      })

    return () => {
      mounted = false
    }
  }, [selectedSubjectSlug])

  const activeSubjects = subjects.filter((s) => !s.isLocked)
  const lockedSubjects = subjects.filter((s) => s.isLocked)

  const selectedSubjectIndex = Math.max(
    0,
    activeSubjects.findIndex((s) => s.slug === selectedSubjectSlug)
  )

  const totalTopics = subjectTopics.length
  const totalPages = Math.ceil(totalTopics / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTopics = subjectTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-4 pb-16 animate-fade-in">
      {/* 1. Sticky Professional Navbar with Official Logo & Integrated Search Bar */}
      <TopNavbar onOpenSearch={onOpenSearch} onOpenProfile={onOpenProfile} />

      {/* 2. Trending High-Yield Topics (Contained inside app margins) */}
      {trending && trending.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-[11px] font-semibold text-slate-600 shrink-0 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Trending:</span>
          </button>
          {trending.slice(0, 6).map((topic) => {
            const shortTitle = topic.title.split(':')[0].split(',')[0]
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.slug)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-[11px] font-medium text-slate-700 hover:text-indigo-600 shrink-0 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                {shortTitle}
              </button>
            )
          })}
        </div>
      )}

      {/* 3. Featured Topic (Compact & Refined Surface with subtle gradient sheen) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 border border-indigo-100/80 p-3.5 shadow-xs hover:border-indigo-200 transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10.5px] font-semibold font-inter border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Featured Topic</span>
              </span>
              <span className="text-[11px] text-slate-300">·</span>
              <span className="text-[11px] text-slate-500 font-inter font-medium">
                10 Practice MCQs
              </span>
            </div>

            <h2 className="text-[15px] font-bold font-outfit text-slate-900 tracking-tight leading-snug">
              Warfarin & DOAC Protocols
            </h2>
            <p className="text-[12px] text-slate-500 font-inter line-clamp-1">
              Reversal agents, INR targets & high-yield differentiators
            </p>
          </div>

          <button
            onClick={() => onSelectTopic('pharm-warfarin-doacs-reversal-agents')}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Active Specialties (Apple iOS Fluid Segmented Control with Smooth Sliding Gradient Pill) */}
      <div className="relative p-1 bg-slate-200/70 rounded-2xl flex items-center shadow-inner">
        {/* Apple Sliding Gradient Pill */}
        {activeSubjects.length > 0 && (
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
            style={{
              width: `calc((100% - 8px) / ${activeSubjects.length})`,
              left: '4px',
              transform: `translateX(${selectedSubjectIndex * 100}%)`,
            }}
          />
        )}

        {activeSubjects.map((subj) => {
          const isSelected = selectedSubjectSlug === subj.slug
          const name = subj.name.split('/')[0].trim()

          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => {
                setSelectedSubjectSlug(subj.slug)
                setCurrentPage(1)
              }}
              className={cn(
                'relative z-10 flex-1 py-2 text-center text-xs font-semibold font-outfit transition-colors duration-200 cursor-pointer select-none rounded-xl active:scale-[0.98]',
                isSelected
                  ? 'text-white font-bold drop-shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* 5. Topics Section (Clean, Paginated & Instantaneous Tab Transition) */}
      <div className="space-y-2 pt-1">
        {/* Loading State */}
        {isLoadingTopics ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Loading clinical topics...</p>
          </div>
        ) : (
          <div key={`${selectedSubjectSlug}-${currentPage}`} className="space-y-2 animate-fade-in">
            {/* Paginated Topics List */}
            <div className="space-y-1.5">
              {paginatedTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.slug)}
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 shadow-card hover:shadow-card-hover text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    {/* Meta row: Subtopic Tag + 90s Card */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                      <span className="font-semibold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md font-inter">
                        {topic.subtopic || 'General'}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 font-normal font-inter">
                        <Clock className="w-3 h-3 text-slate-400" />
                        90s Card
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-[14px] font-semibold font-outfit text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {topic.title}
                    </h3>

                    {/* Acronyms rendered cleanly without raw HTML entities */}
                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  {/* Right Chevron in soft circle */}
                  <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                </button>
              ))}
            </div>

            {/* Apple-Style Refined Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2.5 pb-1 px-1">
                <span className="text-xs text-slate-500 font-medium font-inter">
                  Showing <span className="font-semibold text-slate-800">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalTopics)}</span> of <span className="font-semibold text-slate-800">{totalTopics}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((p) => p - 1)
                        window.scrollTo({ top: 160, behavior: 'smooth' })
                      }
                    }}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition-all active:scale-95 shadow-xs cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 text-[11px] font-semibold text-slate-700 font-inter shadow-xs">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((p) => p + 1)
                        window.scrollTo({ top: 160, behavior: 'smooth' })
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-white border border-slate-200/80 text-slate-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition-all active:scale-95 shadow-xs cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. Upcoming Specialties (Subtle Horizontal Scroll) */}
      {lockedSubjects.length > 0 && (
        <div className="pt-4 border-t border-slate-200/60 space-y-2">
          <div className="px-0.5 text-[12px] font-medium text-slate-400">
            Upcoming Specialties (16)
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {lockedSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setLockedModalSubject(subj.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 text-xs font-medium text-slate-600 whitespace-nowrap active:scale-[0.98] transition-all shadow-xs"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>{subj.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Locked Subject Notification Modal */}
      <LockedSubjectModal
        subjectName={lockedModalSubject}
        isOpen={Boolean(lockedModalSubject)}
        onClose={() => setLockedModalSubject(null)}
      />
    </div>
  )
}
