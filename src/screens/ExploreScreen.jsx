import React, { useState, useEffect } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  BookOpen,
  Target,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import TopNavbar from '../components/TopNavbar'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

const ITEMS_PER_PAGE = 8

export default function ExploreScreen({ onSelectTopic, onOpenSearch, onOpenProfile, onSelectSubjectTab }) {
  const [subjects, setSubjects] = useState([
    { id: 'pharm', name: 'Pharmacology', slug: 'pharmacology', code: 'PHARM' },
    { id: 'path', name: 'Pathology', slug: 'pathology', code: 'PATH' },
    { id: 'psm', name: 'PSM', slug: 'psm', code: 'PSM' },
  ])
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('pharmacology')
  const [subjectTopics, setSubjectTopics] = useState([])
  const [trending, setTrending] = useState([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [liveStats, setLiveStats] = useState({
    total: 234,
    ready: 234,
    subjects: { PHARM: 78, PATH: 86, PSM: 70 },
  })

  // Live progress
  useEffect(() => {
    let mounted = true
    apiService
      .getLiveProgress()
      .then((res) => {
        if (mounted && res?.ok && res.subjects) {
          const statsMap = {}
          res.subjects.forEach((s) => {
            statsMap[s.code] = s.ready
          })
          setLiveStats({
            total: res.overall?.ready || 234,
            ready: res.overall?.ready || 234,
            subjects: statsMap,
          })
        }
      })
      .catch((err) => console.warn('Live progress fetch error:', err))

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

  // Subject topics
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

  const totalTopics = subjectTopics.length
  const totalPages = Math.ceil(totalTopics / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTopics = subjectTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const activeSubjects = subjects.filter((s) => !s.isLocked)
  const selectedSubjectIndex = Math.max(
    0,
    activeSubjects.findIndex((s) => s.slug === selectedSubjectSlug)
  )

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* 1. Sticky Professional Navbar with ClinIQ Branding */}
      <TopNavbar onOpenSearch={onOpenSearch} />

      {/* 2. Live Database Status Bar */}
      <div className="p-3.5 rounded-2xl bg-obsidian-800 border border-obsidian-700/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cliniq-psm animate-pulse" />
            <span className="font-bold text-white tracking-tight">
              ClinIQ High-Yield Database
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            100% Verified
          </span>
        </div>

        {/* 3 Subject Pill Meters */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <div className="p-2 rounded-xl bg-obsidian-850 border border-obsidian-700 flex flex-col">
            <div className="flex items-center justify-between text-[10px] text-obsidian-400">
              <span className="text-cliniq-pharm font-semibold">Pharma</span>
              <span className="font-mono text-white font-bold">{liveStats.subjects.PHARM || 78}/78</span>
            </div>
            <div className="h-1 bg-obsidian-700 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cliniq-pharm w-full rounded-full" />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-obsidian-850 border border-obsidian-700 flex flex-col">
            <div className="flex items-center justify-between text-[10px] text-obsidian-400">
              <span className="text-cliniq-patho font-semibold">Pathology</span>
              <span className="font-mono text-white font-bold">{liveStats.subjects.PATH || 86}/86</span>
            </div>
            <div className="h-1 bg-obsidian-700 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cliniq-patho w-full rounded-full" />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-obsidian-850 border border-obsidian-700 flex flex-col">
            <div className="flex items-center justify-between text-[10px] text-obsidian-400">
              <span className="text-cliniq-psm font-semibold">PSM</span>
              <span className="font-mono text-white font-bold">{liveStats.subjects.PSM || 70}/70</span>
            </div>
            <div className="h-1 bg-obsidian-700 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cliniq-psm w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trending High-Yield Topics */}
      {trending && trending.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-obsidian-800 hover:bg-obsidian-750 text-[11px] font-semibold text-cliniq-pharm shrink-0 transition-colors cursor-pointer border border-obsidian-700"
          >
            <Sparkles className="w-3 h-3 text-cliniq-trap" />
            <span>High-Yield:</span>
          </button>
          {trending.slice(0, 6).map((topic) => {
            const shortTitle = topic.title.split(':')[0].split(',')[0]
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.slug)}
                className="px-2.5 py-1 rounded-full bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-700/80 hover:border-cliniq-pharm/40 text-[11px] font-medium text-obsidian-300 hover:text-white shrink-0 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                {shortTitle}
              </button>
            )
          })}
        </div>
      )}

      {/* 4. Featured Rapid Capsule Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian-800 via-obsidian-800 to-obsidian-850 border border-cliniq-pharm/30 p-4 shadow-sm hover:border-cliniq-pharm/50 transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 text-cliniq-pharm text-[10.5px] font-bold border border-sky-500/20">
                <Sparkles className="w-3 h-3 text-cliniq-trap" />
                <span>Featured Capsule</span>
              </span>
              <span className="text-[11px] text-obsidian-500">·</span>
              <span className="text-[11px] text-obsidian-400 font-medium">
                10 Clinical MCQs
              </span>
            </div>

            <h2 className="text-[15px] font-bold text-white tracking-tight leading-snug">
              Warfarin & DOAC Protocols
            </h2>
            <p className="text-[12px] text-obsidian-300 line-clamp-1">
              Reversal agents, INR targets & high-yield differentiators
            </p>
          </div>

          <button
            onClick={() => onSelectTopic('pharm-warfarin-doacs-reversal-agents')}
            className="py-2 px-3.5 rounded-xl bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Review</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 5. 3-Subject Segmented Switcher */}
      <div className="relative p-1 bg-obsidian-800/90 rounded-2xl flex items-center border border-obsidian-700/80">
        {/* Sliding Pill */}
        {activeSubjects.length > 0 && (
          <div
            className="absolute top-1 bottom-1 rounded-xl bg-obsidian-700 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none border border-obsidian-600"
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
                'relative z-10 flex-1 py-2 text-center text-xs font-semibold transition-colors duration-200 cursor-pointer select-none rounded-xl active:scale-[0.98]',
                isSelected
                  ? 'text-white font-bold'
                  : 'text-obsidian-400 hover:text-white'
              )}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* 6. Topics List */}
      <div className="space-y-2 pt-1">
        {isLoadingTopics ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
            <p className="text-xs text-obsidian-400 font-medium">Loading clinical topics...</p>
          </div>
        ) : (
          <div key={`${selectedSubjectSlug}-${currentPage}`} className="space-y-2 animate-fade-in">
            {/* Paginated Topics */}
            <div className="space-y-1.5">
              {paginatedTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.slug)}
                  className="w-full p-3.5 rounded-xl bg-obsidian-800 border border-obsidian-700 hover:border-cliniq-pharm/50 shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    {/* Meta row: Subtopic Tag + 3-Min Rapid Capsule */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                      <span className="font-semibold text-cliniq-pharm bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20 truncate max-w-[200px]">
                        {topic.subtopic || 'General'}
                      </span>
                      <span className="text-obsidian-400 flex items-center gap-1 font-normal">
                        <Clock className="w-3 h-3 text-obsidian-400" />
                        3-Min Capsule
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-[14px] font-bold text-white group-hover:text-cliniq-pharm transition-colors leading-snug">
                      {topic.title}
                    </h3>

                    {/* Acronyms */}
                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-obsidian-400 truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  <div className="w-7 h-7 rounded-full bg-obsidian-750 group-hover:bg-sky-500/10 text-obsidian-400 group-hover:text-cliniq-pharm flex items-center justify-center transition-colors shrink-0 border border-obsidian-700">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2.5 pb-1 px-1">
                <span className="text-xs text-obsidian-400 font-medium">
                  Showing <span className="font-semibold text-white">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, totalTopics)}</span> of <span className="font-semibold text-white">{totalTopics}</span>
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
                    className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-obsidian-750 transition-all active:scale-95 shadow-xs cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2.5 py-1 rounded-lg bg-obsidian-800 border border-obsidian-700 text-[11px] font-semibold text-white shadow-xs">
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
                    className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-obsidian-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-obsidian-750 transition-all active:scale-95 shadow-xs cursor-pointer"
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
    </div>
  )
}
