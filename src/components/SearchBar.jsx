import React, { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronRight, Lock, TrendingUp } from 'lucide-react'
import { apiService } from '../api/client'
import LockedSubjectModal, { LOCKED_SUBJECTS } from './LockedSubjectModal'
import { cn } from '../utils/cn'

export default function SearchBar({ onSelectTopic, autoFocus = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [trending, setTrending] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [lockedModalSubject, setLockedModalSubject] = useState(null)

  const inputRef = useRef(null)
  const containerRef = useRef(null)
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

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
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
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await apiService.search(searchTerm.trim())
      setResults(data.results || [])
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
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsOpen(true)

    debounceTimerRef.current = setTimeout(() => {
      performSearch(val)
    }, 150)
  }

  const handleSelectTopic = (topic) => {
    setIsOpen(false)
    setQuery('')
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
    setIsOpen(false)
    if (inputRef.current) inputRef.current.focus()
  }

  const getSubjectBadgeStyle = (code) => {
    switch (code) {
      case 'PHARM':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/70'
      case 'PATH':
        return 'text-rose-700 bg-rose-50 border-rose-200/70'
      case 'PSM':
        return 'text-blue-700 bg-blue-50 border-blue-200/70'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  const formatChipTitle = (title) => {
    if (!title) return ''
    const short = title.split(':')[0].trim()
    return short.length > 22 ? short.slice(0, 20) + '…' : short
  }

  const matchedLocked = checkLockedSubject(query)

  return (
    <div ref={containerRef} className="relative w-full z-40">
      {/* Background Dim Scrim when search overlay is open */}
      {isOpen && query.trim().length > 0 && (
        <div
          className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spotlight Search Input */}
      <div className="relative z-50 flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          <Search className="w-4 h-4 stroke-[1.8]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true)
          }}
          placeholder="Search conditions, drugs, guidelines..."
          className="w-full pl-10 pr-9 py-2.5 bg-white text-slate-900 placeholder-slate-400 text-[13px] rounded-xl border border-slate-200/80 hover:border-slate-300 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-xs"
          autoFocus={autoFocus}
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

      {/* Refined High-Yield Chips (When not typing) */}
      {!query && trending.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
          <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-slate-400" />
            <span>High-Yield:</span>
          </span>
          {trending.slice(0, 5).map((trend) => (
            <button
              key={trend.id}
              onClick={() => onSelectTopic(trend.slug)}
              className="px-2.5 py-1 rounded-lg bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 text-[11px] font-medium whitespace-nowrap active:scale-[0.98] transition-all"
            >
              {formatChipTitle(trend.title)}
            </button>
          ))}
        </div>
      )}

      {/* Spotlight Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-[65vh] bg-white border border-slate-200/90 rounded-2xl shadow-spotlight overflow-y-auto z-50 divide-y divide-slate-100 animate-slide-up">
          {/* Header count */}
          <div className="px-4 py-2 text-[11px] font-medium text-slate-400 bg-slate-50/60 flex items-center justify-between">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Locked Subject Notice */}
          {matchedLocked && (
            <div className="p-3.5 bg-amber-50/60 border-b border-amber-200/50 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-amber-900">
                  {matchedLocked} is currently in review
                </h4>
                <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                  Active specialties include Pharmacology, Pathology, and PSM. Protocols for {matchedLocked} are undergoing specialist verification.
                </p>
                <button
                  onClick={() => {
                    setLockedModalSubject(matchedLocked)
                    setIsOpen(false)
                  }}
                  className="mt-1.5 text-xs font-medium text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  <span>Notify when available</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 ? (
            results.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group active:bg-slate-100"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono',
                        getSubjectBadgeStyle(topic.subject?.code)
                      )}
                    >
                      {topic.subject?.code || 'TOPIC'}
                    </span>
                    {topic.subtopic && (
                      <span className="text-[11px] text-slate-400 truncate">
                        {topic.subtopic}
                      </span>
                    )}
                  </div>

                  <h4 className="text-[13px] font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                    {topic.title}
                  </h4>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
            ))
          ) : !isLoading && !matchedLocked ? (
            <div className="p-6 text-center bg-white space-y-1">
              <p className="text-xs font-medium text-slate-700">No results found for "{query}"</p>
              <p className="text-[11px] text-slate-400">
                Try searching by medication name, disease, or medical keyword.
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
