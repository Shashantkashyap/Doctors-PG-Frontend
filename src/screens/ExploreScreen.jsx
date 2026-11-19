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
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAE5DB] hover:bg-[#DDD6C8] text-[11px] font-semibold text-[#434D46] shrink-0 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#64754B]" />
            <span>Trending:</span>
          </button>
          {trending.slice(0, 6).map((topic) => {
            const shortTitle = topic.title.split(':')[0].split(',')[0]
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.slug)}
                className="px-2.5 py-1 rounded-full bg-[#FDFCF9] hover:bg-[#F4F0E8] border border-[#E5E0D5] hover:border-[#D5CFBF] text-[11px] font-medium text-[#2F3731] hover:text-[#1A3626] shrink-0 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                {shortTitle}
              </button>
            )
          })}
        </div>
      )}

      {/* 3. Featured Topic (Editorial Medical Card - Sage & Forest) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F2F6F3] border border-[#D1E1D6] p-4 shadow-xs hover:border-[#B8CEBF] transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E2ECE5] text-[#1A3626] text-[10.5px] font-semibold font-sans border border-[#C5D8CC]">
                <Sparkles className="w-3 h-3 text-[#2E5740]" />
                <span>Featured Topic</span>
              </span>
              <span className="text-[11px] text-[#A4B3A8]">·</span>
              <span className="text-[11px] text-[#5C6860] font-sans font-medium">
                10 Practice MCQs
              </span>
            </div>

            <h2 className="text-[15px] font-semibold font-sans text-[#161B18] tracking-tight leading-snug">
              Warfarin & DOAC Protocols
            </h2>
            <p className="text-[12px] text-[#5C6860] font-sans line-clamp-1">
              Reversal agents, INR targets & high-yield differentiators
            </p>
          </div>

          <button
            onClick={() => onSelectTopic('pharm-warfarin-doacs-reversal-agents')}
            className="py-2 px-3.5 rounded-xl bg-[#1A3626] hover:bg-[#132B1E] text-[#FAF8F5] font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer border border-[#234532]"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Active Specialties (Refined Segmented Control with Solid Forest Pill) */}
      <div className="relative p-1 bg-[#EAE5DB] rounded-2xl flex items-center shadow-inner">
        {/* Sliding Forest Pill */}
        {activeSubjects.length > 0 && (
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-[#1A3626] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
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
                'relative z-10 flex-1 py-2 text-center text-xs font-semibold font-sans transition-colors duration-200 cursor-pointer select-none rounded-xl active:scale-[0.98]',
                isSelected
                  ? 'text-[#FAF8F5] font-bold'
                  : 'text-[#5C6860] hover:text-[#161B18]'
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
            <div className="w-5 h-5 border-2 border-[#D1E1D6] border-t-[#1A3626] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#87928A] font-medium">Loading clinical topics...</p>
          </div>
        ) : (
          <div key={`${selectedSubjectSlug}-${currentPage}`} className="space-y-2 animate-fade-in">
            {/* Paginated Topics List */}
            <div className="space-y-1.5">
              {paginatedTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.slug)}
                  className="w-full p-3.5 rounded-xl bg-[#FDFCF9] border border-[#E5E0D5] hover:border-[#D5CFBF] shadow-xs hover:shadow-card text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    {/* Meta row: Subtopic Tag + 90s Card */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                      <span className="font-semibold text-[#434D46] bg-[#F2EFE8] px-2 py-0.5 rounded-md font-sans">
                        {topic.subtopic || 'General'}
                      </span>
                      <span className="text-[#87928A] flex items-center gap-1 font-normal font-sans">
                        <Clock className="w-3 h-3 text-[#87928A]" />
                        90s Card
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-[14px] font-semibold font-sans text-[#161B18] group-hover:text-[#2E5740] transition-colors leading-snug">
                      {topic.title}
                    </h3>

                    {/* Acronyms rendered cleanly without raw HTML entities */}
                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-[#87928A] truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  {/* Right Chevron in soft circle */}
                  <div className="w-7 h-7 rounded-full bg-[#F4F0E8] group-hover:bg-[#E2ECE5] text-[#87928A] group-hover:text-[#1A3626] flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                </button>
              ))}
            </div>

            {/* Apple-Style Refined Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2.5 pb-1 px-1">
                <span className="text-xs text-[#5C6860] font-medium font-sans">
                  Showing <span className="font-semibold text-[#161B18]">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalTopics)}</span> of <span className="font-semibold text-[#161B18]">{totalTopics}</span>
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
                    className="p-1.5 rounded-lg bg-[#FDFCF9] border border-[#E5E0D5] text-[#434D46] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#F4F0E8] transition-all active:scale-95 shadow-xs cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2.5 py-1 rounded-lg bg-[#FDFCF9] border border-[#E5E0D5] text-[11px] font-semibold text-[#2F3731] font-sans shadow-xs">
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
                    className="p-1.5 rounded-lg bg-[#FDFCF9] border border-[#E5E0D5] text-[#434D46] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#F4F0E8] transition-all active:scale-95 shadow-xs cursor-pointer"
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
        <div className="pt-4 border-t border-[#E8E4DA] space-y-2">
          <div className="px-0.5 text-[12px] font-medium text-[#717E75]">
            Upcoming Specialties (16)
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {lockedSubjects.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setLockedModalSubject(subj.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDFCF9] hover:bg-[#F4F0E8] border border-[#E5E0D5] hover:border-[#D5CFBF] text-xs font-medium text-[#434D46] whitespace-nowrap active:scale-[0.98] transition-all shadow-xs"
              >
                <Lock className="w-3 h-3 text-[#87928A]" />
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
