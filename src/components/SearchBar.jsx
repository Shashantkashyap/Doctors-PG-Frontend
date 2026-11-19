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
        return 'text-[#053F5C] bg-[#E2F3F8] border-[#B8D5E3]'
      case 'PATH':
        return 'text-[#8A5506] bg-[#FEF6E7] border-[#FDEBC8]'
      case 'PSM':
        return 'text-[#1D576A] bg-[#EDF9FC] border-[#B8E5F0]'
      default:
        return 'text-[#053F5C] bg-[#F8FAFC] border-[#E2E8F0]'
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
          className="fixed inset-0 bg-[#053F5C]/20 backdrop-blur-xs z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spotlight Search Input */}
      <div className="relative z-50 flex items-center">
        <div className="absolute left-3.5 text-[#5C768D] pointer-events-none flex items-center">
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
          className="w-full pl-10 pr-9 py-2.5 bg-white text-[#053F5C] placeholder-[#8A9BA8] text-[13px] rounded-xl border border-[#CBD5E1] hover:border-[#429EBD]/60 focus:border-[#429EBD] focus:outline-none focus:ring-2 focus:ring-[#429EBD]/20 transition-all shadow-xs"
          autoFocus={autoFocus}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {isLoading && (
            <div className="w-3.5 h-3.5 border-2 border-[#CBD5E1] border-t-[#053F5C] rounded-full animate-spin" />
          )}

          {query && !isLoading && (
            <button
              onClick={handleClear}
              className="p-1 rounded-md text-[#5C768D] hover:text-[#053F5C] hover:bg-[#F0F6F9] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Refined High-Yield Chips (When not typing) */}
      {!query && trending.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
          <span className="text-[11px] font-medium text-[#5C768D] shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#F7AD19]" />
            <span>High-Yield:</span>
          </span>
          {trending.slice(0, 5).map((trend) => (
            <button
              key={trend.id}
              onClick={() => onSelectTopic(trend.slug)}
              className="px-2.5 py-1 rounded-lg bg-[#E2F3F8] hover:bg-[#C5E6F1] text-[#053F5C] text-[11px] font-medium whitespace-nowrap active:scale-[0.98] transition-all border border-[#B8D5E3] cursor-pointer"
            >
              {formatChipTitle(trend.title)}
            </button>
          ))}
        </div>
      )}

      {/* Spotlight Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 max-h-[65vh] bg-white border border-[#E2E8F0] rounded-2xl shadow-lg overflow-y-auto z-50 divide-y divide-[#E2E8F0] animate-slide-up">
          {/* Header count */}
          <div className="px-4 py-2 text-[11px] font-medium text-[#5C768D] bg-[#F8FAFC] flex items-center justify-between">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Locked Subject Notice */}
          {matchedLocked && (
            <div className="p-3.5 bg-[#FEF6E7] border-b border-[#FDEBC8] flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FDEBC8] text-[#8A5506] flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#8A5506]">
                  {matchedLocked} is currently in review
                </h4>
                <p className="text-[11px] text-[#A26708] mt-0.5 leading-relaxed">
                  Active specialties include Pharmacology, Pathology, and PSM. Protocols for {matchedLocked} are undergoing specialist verification.
                </p>
                <button
                  onClick={() => {
                    setLockedModalSubject(matchedLocked)
                    setIsOpen(false)
                  }}
                  className="mt-1.5 text-xs font-medium text-[#8A5506] hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                className="w-full text-left p-3 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3 group active:bg-[#EDF9FC] cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono',
                        getSubjectBadgeStyle(topic.subject?.code)
                      )}
                    >
                      {topic.subject?.code || 'TOPIC'}
                    </span>
                    {topic.subtopic && (
                      <span className="text-[11px] text-[#5C768D] truncate">
                        {topic.subtopic}
                      </span>
                    )}
                  </div>

                  <h4 className="text-[13px] font-medium text-[#053F5C] group-hover:text-[#429EBD] transition-colors line-clamp-1 leading-snug">
                    {topic.title}
                  </h4>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8A9BA8] group-hover:text-[#053F5C] transition-colors shrink-0" />
              </button>
            ))
          ) : !isLoading && !matchedLocked ? (
            <div className="p-6 text-center bg-white space-y-1">
              <p className="text-xs font-medium text-[#053F5C]">No results found for "{query}"</p>
              <p className="text-[11px] text-[#5C768D]">
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
