import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

export default function SearchScreen({ onClose, onSelectTopic }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [trending, setTrending] = useState([])
  const [latencyMs, setLatencyMs] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([])
      setLatencyMs(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const startTime = Date.now()
    try {
      const data = await apiService.search(searchTerm.trim())
      setResults(data.results || [])
      setLatencyMs(data.latencyMs || Date.now() - startTime)
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
        return 'text-sky-400 bg-sky-500/10 border-sky-500/25'
      case 'PATH':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
      case 'PSM':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/25'
    }
  }

  return (
    <div className="space-y-4 pb-28 animate-fade-in pt-1">
      {/* Top Search Bar Row */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-obsidian-900/95 backdrop-blur-xl border-b border-obsidian-700/80 flex items-center gap-2.5">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-obsidian-800 border border-obsidian-700 shadow-xs flex items-center justify-center text-obsidian-300 hover:text-white hover:bg-obsidian-750 transition-all active:scale-95 shrink-0 cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Input Field */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-obsidian-400 pointer-events-none flex items-center">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search 234 topics, DOCs, IOCs..."
            className="w-full pl-10 pr-9 py-2 bg-obsidian-800 text-white placeholder-obsidian-500 text-xs sm:text-sm rounded-xl border border-obsidian-700 focus:border-cliniq-pharm focus:outline-none focus:ring-1 focus:ring-cliniq-pharm/20 transition-all shadow-xs"
            autoFocus
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin" />
            )}

            {query && !isLoading && (
              <button
                onClick={handleClear}
                className="p-1 rounded-md text-obsidian-400 hover:text-white hover:bg-obsidian-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!query ? (
        /* Empty Query State: High-Yield Trending */
        <div className="space-y-4 pt-1 animate-fade-in">
          {trending.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 px-0.5 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-cliniq-trap" />
                <span className="font-bold text-xs uppercase tracking-wider text-obsidian-400">
                  High-Yield Trending Topics
                </span>
              </div>

              <div className="space-y-1.5">
                {trending.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.slug)}
                    className="w-full p-3.5 rounded-xl bg-obsidian-800 border border-obsidian-700 hover:border-cliniq-pharm/50 shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
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
                          <span className="text-obsidian-400 truncate">
                            {topic.subtopic}
                          </span>
                        )}
                        <span className="text-obsidian-600">·</span>
                        <span className="text-obsidian-400 flex items-center gap-1 font-normal text-[11px]">
                          <Clock className="w-3 h-3 text-obsidian-500" />
                          3-Min Capsule
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-[13.5px] font-bold text-white group-hover:text-cliniq-pharm transition-colors line-clamp-1 leading-snug">
                        {topic.title}
                      </h3>
                    </div>

                    <ChevronRight className="w-4 h-4 text-obsidian-500 group-hover:text-cliniq-pharm transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Search Tip */}
          <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-obsidian-700 space-y-1 text-xs">
            <h4 className="font-bold text-white text-xs">
              ⚡ Instant Global Search
            </h4>
            <p className="text-obsidian-400 leading-relaxed text-[11px]">
              Query across drug aliases (e.g. <em>Rifampicin</em>, <em>Dabigatran</em>), investigations (<em>CBNAAT</em>, <em>dTT</em>), or conditions (<em>Tuberculosis</em>, <em>Glaucoma</em>).
            </p>
          </div>
        </div>
      ) : (
        /* Query Results State */
        <div className="space-y-3 pt-1 animate-fade-in">
          {/* Status line */}
          <div className="flex items-center justify-between px-0.5 text-xs text-obsidian-400">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
            {latencyMs !== null && (
              <span className="font-mono text-[11px] text-obsidian-500">
                {latencyMs}ms
              </span>
            )}
          </div>

          {/* Results List */}
          {results.length > 0 ? (
            <div className="space-y-1.5">
              {results.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className="w-full p-3.5 rounded-xl bg-obsidian-800 border border-obsidian-700 hover:border-cliniq-pharm/50 shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
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
                        <span className="text-obsidian-400 truncate">
                          {topic.subtopic}
                        </span>
                      )}
                      <span className="text-obsidian-600">·</span>
                      <span className="text-obsidian-400 flex items-center gap-1 font-normal text-[11px]">
                        <Clock className="w-3 h-3 text-obsidian-500" />
                        3-Min Capsule
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-[13.5px] font-bold text-white group-hover:text-cliniq-pharm transition-colors line-clamp-1 leading-snug">
                      {topic.title}
                    </h3>

                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-obsidian-400 truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-obsidian-500 group-hover:text-cliniq-pharm transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="py-16 text-center p-6 bg-obsidian-800 rounded-2xl border border-obsidian-700 space-y-1.5">
              <p className="text-xs font-bold text-white">No results found for "{query}"</p>
              <p className="text-[11px] text-obsidian-400 max-w-xs mx-auto leading-relaxed">
                Try searching by drug name, acronym (e.g. ATT, DOAC), or symptom.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
