import React, { useState, useEffect } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Clock,
  RotateCcw,
  Target,
} from 'lucide-react'
import TopNavbar from '../components/TopNavbar'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

const ITEMS_PER_PAGE = 8

// Curated pool of high-yield topics across Pharma, Pathology & PSM for daily challenge rotation (Verified with Backend DB & 10 MCQs)
const FEATURED_CAPSULES_POOL = [
  {
    slug: 'pharm-warfarin-doacs-reversal-agents',
    title: 'Warfarin & DOAC Protocols',
    subtitle: 'Reversal agents, INR targets & high-yield differentiators',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'pharm-anti-tb-drugs-ntep-regimens',
    title: 'Anti-TB Drugs & NTEP Regimens',
    subtitle: 'First-line 2HRZE+4HRE, BPaLM regimen & adverse toxicities',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'path-hodgkin-lymphoma',
    title: 'Hodgkin Lymphoma & RS Variants',
    subtitle: 'Reed-Sternberg variants, Ann Arbor staging & CD15/CD30 markers',
    subject: 'PATH',
    subjectName: 'Pathology',
    color: '#818CF8',
  },
  {
    slug: 'psm-vaccines-uip-cold-chain',
    title: 'UIP Vaccines & Cold Chain Protocols',
    subtitle: 'Zero-dose schedule, open vial policy & ILR temperature cutoffs',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
  {
    slug: 'pharm-teratogenic-drugs-antidotes-master-list',
    title: 'Teratogenic Drugs & Antidotes Master List',
    subtitle: 'FDA categories, fetal anomalies & classic toxicity antidotes',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'path-nephrotic-syndrome',
    title: 'Nephrotic vs Nephritic Syndromes',
    subtitle: 'Minimal change, FSGS, Membranous & Post-strep GN pathology',
    subject: 'PATH',
    subjectName: 'Pathology',
    color: '#818CF8',
  },
  {
    slug: 'psm-study-designs-case-control-cohort-rct',
    title: 'Study Designs: Case-Control, Cohort & RCT',
    subtitle: 'Odds ratio, relative risk, recall bias & randomization protocols',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
  {
    slug: 'pharm-ophthalmic-drugs-glaucoma-mydriatics-dermatological-drugs',
    title: 'Glaucoma & Ophthalmic Therapeutics',
    subtitle: 'Prostaglandin analogues, beta-blockers & acute angle-closure DOC',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'path-multiple-myeloma-plasma-cell-disorders',
    title: 'Multiple Myeloma & Plasma Cell Dyscrasias',
    subtitle: 'CRAB criteria, Bence Jones protein & serum electrophoresis',
    subject: 'PATH',
    subjectName: 'Pathology',
    color: '#818CF8',
  },
  {
    slug: 'psm-screening-tests',
    title: 'Screening Tests & Biostatistics',
    subtitle: 'Sensitivity, Specificity, PPV/NPV & ROC curve cutoffs',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
  {
    slug: 'pharm-antimalarials',
    title: 'Anti-Malarial Regimens & ACT Guidelines',
    subtitle: 'Artemisinin combination therapies, radical cure & G6PD precautions',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'path-amyloidosis',
    title: 'Amyloidosis Classification & Stains',
    subtitle: 'Apple-green birefringence, Congo Red & AL vs AA pathogenesis',
    subject: 'PATH',
    subjectName: 'Pathology',
    color: '#818CF8',
  },
  {
    slug: 'psm-rabies-pep',
    title: 'Rabies Post-Exposure Prophylaxis',
    subtitle: 'WHO bite classification (Category I-III), Essen schedule & RIG',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
  {
    slug: 'pharm-antiepileptics',
    title: 'Antiepileptic Drugs & Protocols',
    subtitle: 'Valproate teratogenicity, status epilepticus DOC & drug levels',
    subject: 'PHARM',
    subjectName: 'Pharmacology',
    color: '#38BDF8',
  },
  {
    slug: 'psm-biomedical-waste-management',
    title: 'Biomedical Waste Management (BMWM)',
    subtitle: 'Yellow/Red/White/Blue color coding rules & autoclave disposal',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
  {
    slug: 'path-acute-leukemias-all-aml',
    title: 'Acute Leukemias: ALL vs AML',
    subtitle: 'Auer rods, MPO, t(15;17) PML-RARA & flow cytometry markers',
    subject: 'PATH',
    subjectName: 'Pathology',
    color: '#818CF8',
  },
  {
    slug: 'psm-ntep',
    title: 'NTEP National TB Elimination Program',
    subtitle: 'Nikshay portal, diagnostic algorithms, CBNAAT/Truenat & BPaLM',
    subject: 'PSM',
    subjectName: 'Community Medicine',
    color: '#34D399',
  },
]

export default function ExploreScreen({ onSelectTopic, onOpenSearch }) {
  const [subjects] = useState([
    { id: 'pharm', name: 'Pharmacology', slug: 'pharmacology', code: 'PHARM' },
    { id: 'path', name: 'Pathology', slug: 'pathology', code: 'PATH' },
    { id: 'psm', name: 'PSM', slug: 'psm', code: 'PSM' },
  ])
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState('pharmacology')
  const [subjectTopics, setSubjectTopics] = useState([])
  const [trending, setTrending] = useState([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Rotating logic for featured topic: changes daily + user can shuffle
  const [featuredOffset, setFeaturedOffset] = useState(() => {
    try {
      const saved = localStorage.getItem('cliniq_featured_offset')
      return saved ? parseInt(saved, 10) : 0
    } catch {
      return 0
    }
  })

  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24))
  const featuredIndex = (dayOfYear + featuredOffset) % FEATURED_CAPSULES_POOL.length
  const featuredTopic = FEATURED_CAPSULES_POOL[featuredIndex]

  const handleShuffleFeatured = (e) => {
    e.stopPropagation()
    const nextOffset = (featuredOffset + 1) % FEATURED_CAPSULES_POOL.length
    setFeaturedOffset(nextOffset)
    try {
      localStorage.setItem('cliniq_featured_offset', nextOffset.toString())
    } catch {}
  }

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

  // Fetch subject topics
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

  const activeSubjects = subjects
  const selectedSubjectIndex = Math.max(
    0,
    activeSubjects.findIndex((s) => s.slug === selectedSubjectSlug)
  )

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* 1. Sticky Professional Navbar with ClinIQ Branding */}
      <TopNavbar onOpenSearch={onOpenSearch} />

      {/* 2. Trending High-Yield Topics */}
      {trending && trending.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-mono font-medium text-zinc-400 shrink-0 px-1">
            High-Yield:
          </span>
          {trending.slice(0, 6).map((topic) => {
            const shortTitle = topic.title.split(':')[0].split(',')[0]
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic.slug)}
                className="px-2.5 py-1 rounded-full bg-[#121622] hover:bg-[#182030] border border-[#20283C] hover:border-[#38435E] text-[11px] font-medium text-zinc-300 hover:text-white shrink-0 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                {shortTitle}
              </button>
            )
          })}
        </div>
      )}

      {/* 3. Daily Clinical MCQ Challenge (Rotates Daily + Direct 10 MCQs Launch) */}
      <div
        onClick={() => onSelectTopic(featuredTopic.slug, 'mcqDrill')}
        className="relative overflow-hidden rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#242C3E] hover:border-[#38435E] p-4 shadow-sm transition-all cursor-pointer group active:scale-[0.99] space-y-2.5"
      >
        {/* Top Header Row: Badges & Shuffle Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10.5px] font-semibold border border-blue-500/20">
              Daily Challenge
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#182030] text-zinc-300 border border-[#252E44]">
              {featuredTopic.subject}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              · 10 MCQs
            </span>
          </div>

          <button
            type="button"
            onClick={handleShuffleFeatured}
            title="Shuffle to another high-yield topic"
            className="w-7 h-7 rounded-lg bg-[#181F30] hover:bg-[#20293E] text-zinc-400 hover:text-white border border-[#283550] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title & Subtitle - Full Width Breathing Room */}
        <div className="space-y-1">
          <h2 className="text-[15px] font-bold text-white tracking-tight leading-snug group-hover:text-blue-300 transition-colors">
            {featuredTopic.title}
          </h2>
          <p className="text-[12px] text-zinc-400 line-clamp-1">
            {featuredTopic.subtitle}
          </p>
        </div>

        {/* Bottom CTA Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1C2334]">
          <span className="text-[11px] text-zinc-400 font-medium">
            Standard Exam Pattern · 4 Options
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelectTopic(featuredTopic.slug, 'mcqDrill')
            }}
            className="py-1.5 px-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span>Solve MCQs</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 4. 3-Subject Segmented Switcher */}
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

      {/* 5. Topics List */}
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
                  className="w-full p-3.5 rounded-xl bg-[#121622] hover:bg-[#161C2C] border border-[#20283C] hover:border-[#38435E] shadow-xs text-left flex items-center justify-between gap-3 group transition-all duration-150 active:scale-[0.99] cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    {/* Meta row: Subtopic Tag + 3-Min Rapid Capsule */}
                    <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                      <span className="font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 truncate max-w-[200px]">
                        {topic.subtopic || 'General'}
                      </span>
                      <span className="text-zinc-400 flex items-center gap-1 font-normal">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        3-Min Capsule
                      </span>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-[14px] font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {topic.title}
                    </h3>

                    {/* Acronyms */}
                    {topic.acronyms && topic.acronyms.length > 0 && (
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-1">
                        {topic.acronyms.slice(0, 4).join('  ·  ')}
                      </p>
                    )}
                  </div>

                  <div className="w-7 h-7 rounded-full bg-[#181F30] group-hover:bg-blue-500/15 text-zinc-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-[#242E42]">
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
