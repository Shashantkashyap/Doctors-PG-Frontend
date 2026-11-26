import React, { useState, useEffect } from 'react'
import {
  Layers,
  Search,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Filter,
} from 'lucide-react'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

const SUBJECT_METADATA = {
  pharmacology: {
    name: 'Pharmacology',
    shortName: 'Pharma',
    code: 'PHARM',
    topicsCount: 78,
    standardBook: 'KD Tripathi 9e / Dr. GRG 9e',
    accentColor: '#38BDF8',
    glowClass: 'from-sky-500/10 to-transparent',
    borderClass: 'border-sky-500/30',
    tagClass: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    activeTabClass: 'bg-sky-500 text-obsidian-950',
  },
  pathology: {
    name: 'Pathology',
    shortName: 'Pathology',
    code: 'PATH',
    topicsCount: 86,
    standardBook: 'Robbins & Kumar 11e (2023)',
    accentColor: '#818CF8',
    glowClass: 'from-indigo-500/10 to-transparent',
    borderClass: 'border-indigo-500/30',
    tagClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    activeTabClass: 'bg-indigo-500 text-white',
  },
  psm: {
    name: 'Community Medicine (PSM)',
    shortName: 'PSM',
    code: 'PSM',
    topicsCount: 70,
    standardBook: "Park's Textbook of PSM 27e (2023)",
    accentColor: '#34D399',
    glowClass: 'from-emerald-500/10 to-transparent',
    borderClass: 'border-emerald-500/30',
    tagClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    activeTabClass: 'bg-emerald-500 text-obsidian-950',
  },
}

export default function SubjectsScreen({ onSelectTopic }) {
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('pharmacology')
  const [topics, setTopics] = useState([])
  const [selectedSubtopic, setSelectedSubtopic] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [liveStats, setLiveStats] = useState({
    total: 234,
    ready: 234,
    subjects: { PHARM: 78, PATH: 86, PSM: 70 },
  })

  // Load Live Progress Counts
  useEffect(() => {
    apiService
      .getLiveProgress()
      .then((res) => {
        if (res?.ok && res.subjects) {
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
  }, [])

  // Load Topics for Selected Subject
  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setSelectedSubtopic('ALL')
    setSearchQuery('')

    apiService
      .getSubjectTopics(selectedSubjectSlug)
      .then((data) => {
        if (mounted && data?.topics) {
          setTopics(data.topics)
        }
      })
      .catch((err) => console.error('Subject topics fetch error:', err))
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [selectedSubjectSlug])

  // Extract unique subtopics
  const subtopics = ['ALL', ...new Set(topics.map((t) => t.subtopic).filter(Boolean))]

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const matchesSubtopic =
      selectedSubtopic === 'ALL' || t.subtopic === selectedSubtopic
    const matchesQuery =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subtopic && t.subtopic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.acronyms && t.acronyms.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())))
    return matchesSubtopic && matchesQuery
  })

  const currentMeta = SUBJECT_METADATA[selectedSubjectSlug] || SUBJECT_METADATA.pharmacology

  return (
    <div className="space-y-4 pb-24 animate-fade-in pt-1">
      {/* 1. Header & Live Verification Badge */}
      <div className="space-y-1 px-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-obsidian-400">
            <Layers className="w-4 h-4 text-cliniq-pharm" />
            <span>Curriculum Explorer</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>234 / 234 Audited</span>
          </span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">
          Cornerstone MBBS Subjects
        </h1>
        <p className="text-xs text-obsidian-400">
          Grounded in gold standard textbooks with Dual-Pipeline LLM verification.
        </p>
      </div>

      {/* 2. Three Subject Selector Cards */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(SUBJECT_METADATA).map(([slug, meta]) => {
          const isSelected = selectedSubjectSlug === slug
          const count = liveStats.subjects[meta.code] || meta.topicsCount

          return (
            <button
              key={slug}
              type="button"
              onClick={() => setSelectedSubjectSlug(slug)}
              className={cn(
                'p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer active:scale-[0.98] flex flex-col justify-between relative overflow-hidden',
                isSelected
                  ? `bg-obsidian-800 ${meta.borderClass} shadow-md`
                  : 'bg-obsidian-850 border-obsidian-700/80 hover:border-obsidian-600 opacity-75 hover:opacity-100'
              )}
            >
              <div className="space-y-1">
                <span
                  className={cn(
                    'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider inline-block',
                    meta.tagClass
                  )}
                >
                  {meta.code}
                </span>
                <h3 className="text-xs font-bold text-white leading-tight truncate">
                  {meta.shortName}
                </h3>
              </div>

              <div className="mt-2 pt-1 border-t border-obsidian-700/50 flex items-center justify-between text-[11px]">
                <span className="font-mono font-semibold text-white">
                  {count}
                </span>
                <span className="text-[10px] text-obsidian-400">topics</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* 3. Subject Detail Header Card */}
      <div
        className={cn(
          'p-3.5 rounded-2xl bg-gradient-to-br bg-obsidian-800 border p-3.5 space-y-2',
          currentMeta.glowClass,
          currentMeta.borderClass
        )}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{currentMeta.name}</span>
              <span className="text-[11px] font-mono font-normal text-obsidian-400">
                ({topics.length} topics)
              </span>
            </h2>
            <p className="text-[11px] text-obsidian-300 font-sans flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-obsidian-400 shrink-0" />
              <span>Grounded in: {currentMeta.standardBook}</span>
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-obsidian-750 border border-obsidian-600 text-cliniq-pharm font-bold">
            NEET PG
          </span>
        </div>
      </div>

      {/* 4. Subtopic Pills Filter */}
      {subtopics.length > 2 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-obsidian-400 px-0.5">
            <Filter className="w-3 h-3" />
            <span>Filter by System / Unit:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {subtopics.map((sub) => {
              const isActive = selectedSubtopic === sub
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubtopic(sub)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer',
                    isActive
                      ? 'bg-obsidian-700 text-white font-bold border border-obsidian-500 shadow-xs'
                      : 'bg-obsidian-800/80 text-obsidian-400 hover:text-white border border-obsidian-700/60'
                  )}
                >
                  {sub === 'ALL' ? 'All Units' : sub}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 5. In-Subject Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-obsidian-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Filter ${topics.length} ${currentMeta.shortName} topics...`}
          className="w-full pl-9 pr-3 py-2 bg-obsidian-800 text-white placeholder-obsidian-400 text-xs rounded-xl border border-obsidian-700 focus:border-cliniq-pharm focus:outline-none focus:ring-1 focus:ring-cliniq-pharm/20 transition-all"
        />
      </div>

      {/* 6. Filtered Topics List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-5 h-5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
            <p className="text-xs text-obsidian-400">Loading {currentMeta.shortName} topics...</p>
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="space-y-1.5">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => onSelectTopic(topic.slug)}
                className="w-full p-3.5 rounded-xl bg-[#121622] border border-[#222A3C] hover:border-[#343F5C] shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  {/* Meta row: Subtopic Tag + 3-Min Rapid Capsule */}
                  <div className="flex items-center gap-2 mb-1 text-[10.5px]">
                    <span className="font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 truncate max-w-[200px]">
                      {topic.subtopic || 'General'}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1 font-normal">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      3-Min Capsule
                    </span>
                  </div>

                  {/* Topic Title */}
                  <h3 className="text-xs sm:text-[13.5px] font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {topic.title}
                  </h3>

                  {/* Acronyms */}
                  {topic.acronyms && topic.acronyms.length > 0 && (
                    <p className="text-[11px] font-mono text-zinc-400 truncate mt-1">
                      {topic.acronyms.slice(0, 4).join('  ·  ')}
                    </p>
                  )}
                </div>

                <div className="w-7 h-7 rounded-full bg-[#181F30] group-hover:bg-[#20283C] text-zinc-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-[#283550]">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center p-6 bg-obsidian-800 rounded-2xl border border-obsidian-700 space-y-1.5">
            <p className="text-xs font-bold text-white">No matching topics found</p>
            <p className="text-[11px] text-obsidian-400">
              Try adjusting your search query or unit filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
