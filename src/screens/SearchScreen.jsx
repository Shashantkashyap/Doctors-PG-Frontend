import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Lock,
  Clock,
  Sparkles,
} from 'lucide-react'
import { apiService } from '../api/client'
import LockedSubjectModal, { LOCKED_SUBJECTS } from '../components/LockedSubjectModal'
import { cn } from '../utils/cn'

export default function SearchScreen({ onClose, onSelectTopic }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [trending, setTrending] = useState([])
  const [latencyMs, setLatencyMs] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lockedModalSubject, setLockedModalSubject] = useState(null)

  const inputRef = useRef(null)
  const debounceTimerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    apiService
      .getTrending()
      .then((data) => {
        if (mounted && data?.topics) {
          setTrending(data.topics)
        }
      })
      .catch(() => {})

    // Auto focus the search input
    if (inputRef.current) {
      inputRef.current.focus()
    }

    return () => {
      mounted = false
    }
  }, [])

  const checkLockedSubject = (q) => {
    const clean = q.trim().toLowerCase()
    return LOCKED_SUBJECTS.find((subj) => {
      const s = subj.toLowerCase()
      return clean.includes(s) || s.includes(clean)
    })
  }

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([])
      setLatencyMs(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await apiService.search(searchTerm.trim())
      setResults(data.results || [])
      setLatencyMs(data.latencyMs || null)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!val.trim()) {
      setResults([])
      setLatencyMs(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimerRef.current = setTimeout(() => {
      performSearch(val)
    }, 120)
  }

  const handleSelectTopic = (topic) => {
    if (topic?.id) {
      apiService.recordSearchClick(topic.id, query).catch(() => {})
    }
    if (onSelectTopic) {
      onSelectTopic(topic.slug)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setLatencyMs(null)
    if (inputRef.current) inputRef.current.focus()
  }

  const getSubjectBadgeStyle = (code) => {
    switch (code) {
      case 'PHARM':
        return 'text-[#173926] bg-[#F1F6F2] border-[#D1E1D6]'
      case 'PATH':
        return 'text-[#68241C] bg-[#FAF2F0] border-[#EED7D2]'
      case 'PSM':
        return 'text-[#193C48] bg-[#F0F5F6] border-[#D0DFE4]'
      default:
        return 'text-[#202622] bg-[#FAF8F5] border-[#E5E0D5]'
    }
  }

  const matchedLocked = checkLockedSubject(query)

  return (
    <div className="space-y-4 pb-28 animate-fade-in pt-1">
      {/* Top Search Bar Row */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-[#FAF8F5]/92 backdrop-blur-xl border-b border-[#E5E0D5] flex items-center gap-2.5">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-[#FDFCF9] border border-[#E5E0D5] shadow-xs flex items-center justify-center text-[#161B18] hover:bg-[#FAF8F5] transition-all active:scale-95 shrink-0 cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Input Field */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-[#7D8880] pointer-events-none flex items-center">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search topics, drugs, guidelines..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#FDFCF9] text-[#161B18] placeholder-[#8A958E] text-sm rounded-xl border border-[#DCD6C9] focus:border-[#2E5740] focus:outline-none focus:ring-2 focus:ring-[#2E5740]/15 transition-all shadow-xs"
            autoFocus
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-[#DCD6C9] border-t-[#1A3626] rounded-full animate-spin" />
            )}

            {query && !isLoading && (
              <button
                onClick={handleClear}
                className="p-1 rounded-md text-[#7D8880] hover:text-[#161B18] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!query ? (
        /* Empty Query State: High-Yield Trending & Quick Browse */
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* Trending High-Yield Topics */}
          {trending.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 text-xs font-semibold text-[#161B18]">
                <Sparkles className="w-3.5 h-3.5 text-[#4F5D3A]" />
                <span className="font-serif font-bold text-[14px]">High-Yield Trending Topics</span>
              </div>

              <div className="space-y-2">
                {trending.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.slug)}
                    className="w-full p-3.5 rounded-xl bg-[#FDFCF9] border border-[#E5E0D5] hover:border-[#DDD6C8] shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                        <span
                          className={cn(
                            'font-bold px-1.5 py-0.5 rounded border font-mono text-[10px]',
                            getSubjectBadgeStyle(topic.subject?.code)
                          )}
                        >
                          {topic.subject?.code || 'TOPIC'}
                        </span>
                        {topic.subtopic && (
                          <span className="text-[#7D8880] truncate">
                            {topic.subtopic}
                          </span>
                        )}
                        <span className="text-[#DDD6C8]">·</span>
                        <span className="text-[#7D8880] flex items-center gap-1 font-normal text-[11px]">
                          <Clock className="w-3 h-3 text-[#7D8880]" />
                          90s Card
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#161B18] group-hover:text-[#2E5740] transition-colors line-clamp-1 leading-snug">
                        {topic.title}
                      </h3>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:text-[#161B18] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] shadow-xs space-y-1.5 text-xs">
            <h4 className="font-serif font-bold text-[#161B18] text-[13px]">
              Quick Search Tips
            </h4>
            <p className="text-[#5C6860] leading-relaxed text-[12px]">
              Search by drug name (e.g., <em>Warfarin</em>, <em>Dabigatran</em>), investigation (<em>IOC</em>, <em>dTT</em>), or condition (<em>Tuberculosis</em>, <em>Glaucoma</em>) to instantly retrieve clinical pearls and comparison matrices.
            </p>
          </div>
        </div>
      ) : (
        /* Query Results State */
        <div className="space-y-3 pt-1 animate-fade-in">
          {/* Status line */}
          <div className="flex items-center justify-between px-0.5 text-xs text-[#5C6860]">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
            {latencyMs && (
              <span className="font-mono text-[11px] text-[#7D8880]">
                {latencyMs}ms
              </span>
            )}
          </div>

          {/* Locked Subject Notice */}
          {matchedLocked && (
            <div className="p-4 bg-[#FAF5ED] border border-[#E8DEC8] rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F2E8D5] text-[#7A6129] flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#5A451A]">
                  {matchedLocked} is currently in editorial review
                </h4>
                <p className="text-[11px] text-[#7A6129] mt-0.5 leading-relaxed">
                  Currently covering Pharmacology, Pathology, and PSM. Protocols for {matchedLocked} are undergoing specialist verification.
                </p>
                <button
                  onClick={() => setLockedModalSubject(matchedLocked)}
                  className="mt-2 text-xs font-semibold text-[#5A451A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Notify when available</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="w-full p-3.5 rounded-xl bg-[#FDFCF9] border border-[#E5E0D5] hover:border-[#DDD6C8] shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                      <span
                        className={cn(
                          'font-bold px-1.5 py-0.5 rounded border font-mono text-[10px]',
                          getSubjectBadgeStyle(topic.subject?.code)
                        )}
                      >
                        {topic.subject?.code || 'TOPIC'}
                      </span>
                      {topic.subtopic && (
                        <span className="text-[#7D8880] truncate">
                          {topic.subtopic}
                        </span>
                      )}
                      <span className="text-[#DDD6C8]">·</span>
                      <span className="text-[#7D8880] flex items-center gap-1 font-normal text-[11px]">
                        <Clock className="w-3 h-3 text-[#7D8880]" />
                        90s Card
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#161B18] group-hover:text-[#2E5740] transition-colors line-clamp-1 leading-snug">
                      {topic.title}
                    </h3>

                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-[#7D8880] truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:text-[#161B18] transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : !isLoading && !matchedLocked ? (
            <div className="py-16 text-center p-6 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] shadow-xs space-y-1.5">
              <p className="text-xs font-serif font-bold text-[#161B18]">No results found for "{query}"</p>
              <p className="text-[11px] text-[#5C6860] max-w-xs mx-auto leading-relaxed">
                Check spelling or search by general medication name, symptom, or guideline keyword.
              </p>
            </div>
          ) : null}
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
