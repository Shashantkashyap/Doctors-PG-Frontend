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
        return 'text-emerald-700 bg-emerald-50 border-emerald-200'
      case 'PATH':
        return 'text-rose-700 bg-rose-50 border-rose-200'
      case 'PSM':
        return 'text-blue-700 bg-blue-50 border-blue-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  const matchedLocked = checkLockedSubject(query)

  return (
    <div className="space-y-4 pb-28 animate-fade-in pt-1">
      {/* Top Search Bar Row */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-[#F8F9FA]/92 backdrop-blur-xl border-b border-slate-200/50 flex items-center gap-2.5">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all active:scale-95 shrink-0"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Input Field */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search topics, drugs, guidelines..."
            className="w-full pl-10 pr-9 py-2.5 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border border-slate-200/90 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-xs"
            autoFocus
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
            )}

            {query && !isLoading && (
              <button
                onClick={handleClear}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
              <div className="flex items-center gap-1.5 px-0.5 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>High-Yield Trending Topics</span>
              </div>

              <div className="space-y-2">
                {trending.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.slug)}
                    className="w-full p-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 shadow-card hover:shadow-card-hover text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                        <span
                          className={cn(
                            'font-bold px-1.5 py-0.2 rounded border font-mono',
                            getSubjectBadgeStyle(topic.subject?.code)
                          )}
                        >
                          {topic.subject?.code || 'TOPIC'}
                        </span>
                        {topic.subtopic && (
                          <span className="text-slate-400 truncate">
                            {topic.subtopic}
                          </span>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400 flex items-center gap-1 font-normal">
                          <Clock className="w-3 h-3 text-slate-400" />
                          90s Card
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold font-outfit text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {topic.title}
                      </h3>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs space-y-1.5 text-xs">
            <h4 className="font-bold text-slate-800 font-outfit">
              Quick Search Tips
            </h4>
            <p className="text-slate-500 leading-relaxed text-[12px] font-inter">
              Search by drug name (e.g., <em>Warfarin</em>, <em>Dabigatran</em>), investigation (<em>IOC</em>, <em>dTT</em>), or condition (<em>Tuberculosis</em>, <em>Glaucoma</em>) to instantly retrieve clinical pearls and comparison matrices.
            </p>
          </div>
        </div>
      ) : (
        /* Query Results State */
        <div className="space-y-3 pt-1 animate-fade-in">
          {/* Status line */}
          <div className="flex items-center justify-between px-0.5 text-xs text-slate-500">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
            {latencyMs && (
              <span className="font-mono text-[11px] text-slate-400">
                {latencyMs}ms
              </span>
            )}
          </div>

          {/* Locked Subject Notice */}
          {matchedLocked && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-amber-900">
                  {matchedLocked} is currently in editorial review
                </h4>
                <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                  Currently covering Pharmacology, Pathology, and PSM. Protocols for {matchedLocked} are undergoing specialist verification.
                </p>
                <button
                  onClick={() => setLockedModalSubject(matchedLocked)}
                  className="mt-2 text-xs font-semibold text-amber-900 hover:underline inline-flex items-center gap-1"
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
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 shadow-card hover:shadow-card-hover text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                      <span
                        className={cn(
                          'font-bold px-1.5 py-0.2 rounded border font-mono',
                          getSubjectBadgeStyle(topic.subject?.code)
                        )}
                      >
                        {topic.subject?.code || 'TOPIC'}
                      </span>
                      {topic.subtopic && (
                        <span className="text-slate-400 truncate">
                          {topic.subtopic}
                        </span>
                      )}
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400 flex items-center gap-1 font-normal">
                        <Clock className="w-3 h-3 text-slate-400" />
                        90s Card
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold font-outfit text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                      {topic.title}
                    </h3>

                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : !isLoading && !matchedLocked ? (
            <div className="py-16 text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
              <p className="text-xs font-semibold text-slate-700">No results found for "{query}"</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
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
