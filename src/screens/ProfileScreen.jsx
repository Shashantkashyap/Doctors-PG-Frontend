import React, { useState, useEffect } from 'react'
import {
  User,
  LogOut,
  Check,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Filter,
  Smartphone,
  PlusSquare,
  Stethoscope,
  Microscope,
  Pill,
  ShieldCheck,
  Activity,
  Flame,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../api/client'
import { analyticsStore } from '../utils/analyticsStore'
import { cn } from '../utils/cn'
import InstallShortcutModal from '../components/InstallShortcutModal'

const EXAMS = [
  { id: 'NEET_PG', label: 'NEET PG' },
  { id: 'INI_CET', label: 'INI-CET' },
  { id: 'FMGE', label: 'FMGE' },
]

export default function ProfileScreen({
  onSelectTopic,
  onStartPracticeSubject,
  onStartPracticeTopic,
}) {
  const { user, logout, updateTargetExam } = useAuth()
  const [isUpdatingExam, setIsUpdatingExam] = useState(false)
  const [successNote, setSuccessNote] = useState('')
  const [topicFilter, setTopicFilter] = useState('ALL') // 'ALL' | 'PHARM' | 'PATH' | 'PSM' | 'WEAK'
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [analytics, setAnalytics] = useState(() =>
    analyticsStore.getAnalyticsSummary()
  )

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setIsStandalone(Boolean(standalone))

    // 1. Initial local analytics
    const localData = analyticsStore.getAnalyticsSummary()
    setAnalytics(localData)

    // 2. Fetch live telemetry from backend
    apiService
      .getProgressSummary()
      .then((res) => {
        if (res?.success && res.summary) {
          setAnalytics((prev) => {
            const bAttempted = res.summary.totalQuestionsAttempted || 0
            const bCorrect = res.summary.totalQuestionsCorrect || 0
            const bAccuracy = res.summary.overallAccuracy || 0
            const bMastered = res.summary.masteryCounts?.mastered || 0

            const rawSubjList = res.summary.subjectBreakdown || res.subjectBreakdown
            let updatedSubjects = prev.subjectBreakdown
            if (Array.isArray(rawSubjList) && rawSubjList.length > 0) {
              updatedSubjects = rawSubjList.map((sb) => {
                const prevSubj = prev.subjectBreakdown.find((s) => s.code === sb.code || s.slug === sb.slug)
                return {
                  ...(prevSubj || {}),
                  code: sb.code,
                  name: sb.name,
                  slug: sb.slug,
                  attempted: sb.attempted,
                  correct: sb.correct,
                  accuracy: sb.accuracyPercent || 0,
                  topicsCount: sb.topicsCount,
                }
              })
            }

            let updatedTopics = [...prev.topicBreakdown]
            if (Array.isArray(res.topicProgressList) && res.topicProgressList.length > 0) {
              const remoteMap = new Map(res.topicProgressList.map((p) => [p.topicSlug, p]))

              // 1. Update existing topics
              updatedTopics = updatedTopics.map((t) => {
                const remote = remoteMap.get(t.topicSlug)
                if (remote) {
                  return {
                    ...t,
                    attempted: remote.attemptedCount,
                    correct: Math.max(0, remote.attemptedCount - remote.wrongCount),
                    accuracy: remote.accuracyPercent,
                    status:
                      remote.masteryStatus === 'mastered'
                        ? 'Mastered'
                        : remote.accuracyPercent >= 60
                        ? 'Solid'
                        : 'Needs Revision',
                  }
                }
                return t
              })

              // 2. Prepend any newly practiced topics not in initial list
              const existingSlugs = new Set(updatedTopics.map((t) => t.topicSlug))
              for (const remote of res.topicProgressList) {
                if (!existingSlugs.has(remote.topicSlug)) {
                  updatedTopics.unshift({
                    topicId: remote.topicId,
                    topicSlug: remote.topicSlug,
                    title: remote.topicTitle,
                    subjectCode: remote.subject?.code || 'PHARM',
                    subjectName: remote.subject?.name || 'Pharmacology',
                    subjectSlug: remote.subject?.slug || 'pharmacology',
                    attempted: remote.attemptedCount,
                    correct: Math.max(0, remote.attemptedCount - remote.wrongCount),
                    accuracy: remote.accuracyPercent,
                    status:
                      remote.masteryStatus === 'mastered'
                        ? 'Mastered'
                        : remote.accuracyPercent >= 60
                        ? 'Solid'
                        : 'Needs Revision',
                  })
                  existingSlugs.add(remote.topicSlug)
                }
              }
            }

            return {
              ...prev,
              overall: {
                ...prev.overall,
                totalAttempted: Math.max(prev.overall.totalAttempted, bAttempted),
                totalCorrect: Math.max(prev.overall.totalCorrect, bCorrect),
                overallAccuracy: bAttempted > 0 ? bAccuracy : prev.overall.overallAccuracy,
                masteredCount: Math.max(prev.overall.masteredCount, bMastered),
              },
              subjectBreakdown: updatedSubjects,
              topicBreakdown: updatedTopics,
            }
          })
        }
      })
      .catch((err) => {
        console.warn('Backend progress summary load fallback:', err)
      })
  }, [])

  if (!user) return null

  // Initials
  const initials = user.name
    ? user.name
        .replace(/^(Dr\.|Dr)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DR'

  const handleExamChange = async (examId) => {
    if (examId === user.targetExam || isUpdatingExam) return
    setIsUpdatingExam(true)
    const res = await updateTargetExam(examId)
    setIsUpdatingExam(false)
    if (res?.success) {
      setSuccessNote(`Target updated to ${examId.replace('_', ' ')}`)
      setTimeout(() => setSuccessNote(''), 2500)
    }
  }

  // Filter topics based on active tab
  const filteredTopics = analytics.topicBreakdown.filter((t) => {
    if (topicFilter === 'ALL') return true
    if (topicFilter === 'WEAK') return t.attempted > 0 && t.accuracy < 70
    return t.subjectCode === topicFilter
  })

  const getSubjectBadgeStyle = (code) => {
    switch (code) {
      case 'PHARM':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/25'
      case 'PATH':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
      case 'PSM':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
      default:
        return 'text-obsidian-300 bg-obsidian-750 border-obsidian-700'
    }
  }

  const getSubjectIcon = (code) => {
    switch (code) {
      case 'PHARM':
        return <Pill className="w-3.5 h-3.5 text-sky-400" />
      case 'PATH':
        return <Microscope className="w-3.5 h-3.5 text-indigo-400" />
      case 'PSM':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
      default:
        return <Activity className="w-3.5 h-3.5 text-cliniq-pharm" />
    }
  }

  const getAccuracyBadge = (accuracy, attempted) => {
    if (attempted === 0) {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-obsidian-750 border border-obsidian-700 text-obsidian-400">
          Unattempted
        </span>
      )
    }
    if (accuracy >= 80) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1">
          <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
          <span>{accuracy}% · Mastered</span>
        </span>
      )
    }
    if (accuracy >= 60) {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300">
          {accuracy}% · Solid
        </span>
      )
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-1">
        <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
        <span>{accuracy}% · Needs Revision</span>
      </span>
    )
  }

  // Clinical Readiness Tier calculation
  const overallAcc = analytics.overall.overallAccuracy || 0
  const totalAtt = analytics.overall.totalAttempted || 0

  let readinessBadge = {
    title: 'Clinical Foundation Phase',
    subtitle: 'Solve daily MCQ drills to unlock rank predictor',
    style: 'from-obsidian-800 to-obsidian-850 border-obsidian-700 text-obsidian-300',
    indicator: 'bg-obsidian-500',
  }

  if (totalAtt >= 20) {
    if (overallAcc >= 80) {
      readinessBadge = {
        title: 'Top 1,000 Rank Benchmark',
        subtitle: 'Elite recall retention · 99th percentile speed & accuracy',
        style: 'from-emerald-950/40 via-obsidian-800 to-obsidian-850 border-emerald-500/30 text-emerald-300',
        indicator: 'bg-emerald-400',
      }
    } else if (overallAcc >= 65) {
      readinessBadge = {
        title: 'Top 5,000 Rank Potential',
        subtitle: 'Solid diagnostic acumen · Eliminate weak topic penalties',
        style: 'bg-[#151C2C] border-[#25324D] text-zinc-200',
        indicator: 'bg-blue-400',
      }
    } else {
      readinessBadge = {
        title: 'High-Yield Drill Phase',
        subtitle: 'Focus on ⚠️ Weak Topics (<70%) to boost negative marking',
        style: 'bg-[#1C1814] border-[#3D2E1A] text-amber-200',
        indicator: 'bg-amber-400',
      }
    }
  }

  return (
    <div className="space-y-4 pb-32 animate-fade-in pt-1">
      {/* 1. Doctor Profile Hero Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111624] border border-[#20283C] shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Clinical Avatar with Verified Stethoscope Badge */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-[#182032] text-white font-sans font-black text-xl flex items-center justify-center shadow-xs border border-[#283654]">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0D111A] border border-[#283654] flex items-center justify-center text-blue-400 shadow-xs">
                <Stethoscope className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold font-sans text-white truncate">
                  {user.name}
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#182032] text-zinc-300 border border-[#283654]">
                  MD Resident
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate font-sans">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/25 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Clinical Readiness Rank Predictor Banner */}
        <div className={cn(
          'p-3 rounded-xl border flex items-center gap-3 transition-all',
          readinessBadge.style
        )}>
          <span className={cn('w-2 h-2 rounded-full shrink-0 animate-pulse', readinessBadge.indicator)} />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>{readinessBadge.title}</span>
            </h4>
            <p className="text-[11px] text-zinc-400 leading-tight mt-0.5 truncate">
              {readinessBadge.subtitle}
            </p>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        </div>

        {/* Target Examination Switcher */}
        <div className="p-3 bg-[#151B2A] rounded-xl border border-[#20283C] space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-medium text-zinc-400 font-sans">
              Target Examination
            </span>
            <span className="text-[11px] font-semibold text-white font-sans">
              {user.targetExam?.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-[#0E121E] rounded-lg border border-[#1E2538]">
            {EXAMS.map((exam) => {
              const isSelected = user.targetExam === exam.id
              return (
                <button
                  key={exam.id}
                  onClick={() => handleExamChange(exam.id)}
                  disabled={isUpdatingExam}
                  className={cn(
                    'py-1.5 px-2 text-[11px] font-medium font-sans rounded-md transition-all cursor-pointer active:scale-95 text-center',
                    isSelected
                      ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  )}
                >
                  {exam.label}
                </button>
              )
            })}
          </div>

          {successNote && (
            <div className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 p-1.5 rounded-lg text-center flex items-center justify-center gap-1 animate-fade-in">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{successNote}</span>
            </div>
          )}
        </div>

        {/* Device Shortcut / PWA Status & Telemetry Sync */}
        <div className="pt-2 border-t border-obsidian-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="w-4 h-4 text-cliniq-pharm shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {isStandalone ? 'Home Screen Shortcut Active' : 'Add to Home Screen'}
              </p>
              <p className="text-[10px] text-obsidian-400 truncate">
                {isStandalone
                  ? 'Running in full-screen standalone mode'
                  : 'Install 1-tap app on your mobile home screen'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-750 text-white text-xs font-bold border border-obsidian-700 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 shadow-xs"
          >
            {isStandalone ? (
              <>
                <Check className="w-3.5 h-3.5 text-cliniq-psm" />
                <span>Installed</span>
              </>
            ) : (
              <>
                <PlusSquare className="w-3.5 h-3.5 text-cliniq-pharm" />
                <span>Add Shortcut</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Overall Accuracy & Performance Scorecard (Clinical Vitals HUD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Overall Accuracy */}
        <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium text-[11px] text-zinc-300">Accuracy</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold font-sans text-white tracking-tight">
            {analytics.overall.overallAccuracy}%
          </p>
          <p className="text-[10px] text-zinc-400 font-normal">
            {analytics.overall.totalCorrect} / {analytics.overall.totalAttempted} Correct
          </p>
        </div>

        {/* Questions Done */}
        <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium text-[11px] text-zinc-300">MCQs Done</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-sans text-white tracking-tight">
            {analytics.overall.totalAttempted}
          </p>
          <p className="text-[10px] text-zinc-400 font-normal">
            Clinical Vignettes
          </p>
        </div>

        {/* Cards Mastered */}
        <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium text-[11px] text-zinc-300">Mastered</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-sans text-white tracking-tight">
            {analytics.overall.masteredCount}
          </p>
          <p className="text-[10px] text-zinc-400 font-normal">
            ≥80% Recall Rate
          </p>
        </div>

        {/* Topics Tracked */}
        <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-medium text-[11px] text-zinc-300">Topics</span>
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold font-sans text-white tracking-tight">
            {analytics.overall.totalTopicsTracked}
          </p>
          <p className="text-[10px] text-zinc-400 font-normal">
            High-Yield Syllabus
          </p>
        </div>
      </div>

      {/* 3. Subject-Wise Accuracy Analysis */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between px-0.5">
          <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Specialty Diagnostic Matrix</span>
          </h3>
          <span className="text-[11px] text-zinc-400 font-sans font-normal">
            Subject performance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {analytics.subjectBreakdown.map((subj) => {
            const isPharm = subj.code === 'PHARM'
            const isPatho = subj.code === 'PATH'
            return (
              <div
                key={subj.code}
                className="p-4 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs space-y-3 hover:border-[#323D59] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border inline-flex items-center gap-1',
                          getSubjectBadgeStyle(subj.code)
                        )}
                      >
                        {getSubjectIcon(subj.code)}
                        <span>{subj.code}</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white font-sans">
                      {subj.name}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-white font-sans">
                      {subj.accuracy}%
                    </span>
                    <p className="text-[10px] text-zinc-400 font-normal">
                      {subj.correct}/{subj.attempted} Qs
                    </p>
                  </div>
                </div>

                {/* Multi-tone Clinical Progress Bar */}
                <div className="w-full bg-[#182030] h-2 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isPharm
                        ? 'bg-blue-500'
                        : isPatho
                        ? 'bg-indigo-500'
                        : 'bg-emerald-500'
                    )}
                    style={{ width: `${Math.max(5, subj.accuracy)}%` }}
                  />
                </div>

                {/* Direct Specialty Practice Action */}
                <button
                  type="button"
                  onClick={() => {
                    if (onStartPracticeSubject) {
                      onStartPracticeSubject(subj.slug)
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#181F30] hover:bg-[#20283C] text-white text-[11px] font-semibold border border-[#283550] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Practice {subj.name}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-300 stroke-[2.2]" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Topic-Wise Detailed Breakdown */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-0.5">
          <div>
            <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Topic-Wise Clinical Retention</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans font-normal">
              Accuracy and recall status per clinical capsule
            </p>
          </div>

          {/* Filter Pills with Highlighted Weak Topics Pill */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PHARM', label: 'Pharma' },
              { id: 'PATH', label: 'Patho' },
              { id: 'PSM', label: 'PSM' },
              { id: 'WEAK', label: '⚠️ Weak (<70%)' },
            ].map((f) => {
              const isSelected = topicFilter === f.id
              const isWeakFilter = f.id === 'WEAK'
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTopicFilter(f.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer border active:scale-95',
                    isSelected
                      ? isWeakFilter
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold shadow-xs'
                        : 'bg-white text-zinc-950 font-semibold border-white shadow-xs'
                      : isWeakFilter
                      ? 'bg-[#181216] text-rose-400/90 border-rose-500/25 hover:bg-rose-500/10'
                      : 'bg-[#141926] text-zinc-400 hover:text-white border-[#20273A]'
                  )}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-2">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-3.5 rounded-2xl bg-obsidian-800 border border-obsidian-700/80 hover:border-obsidian-600 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] flex-wrap">
                    <span
                      className={cn(
                        'font-bold px-1.5 py-0.5 rounded border font-mono text-[10px]',
                        getSubjectBadgeStyle(topic.subjectCode)
                      )}
                    >
                      {topic.subjectCode}
                    </span>
                    {getAccuracyBadge(topic.accuracy, topic.attempted)}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTopic(topic.topicSlug)}
                    className="text-left font-semibold text-[13px] text-white hover:text-blue-300 transition-colors leading-snug cursor-pointer line-clamp-1"
                  >
                    {topic.title}
                  </button>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-400">
                    <span>
                      Recall: <strong className="text-white">{topic.correct} / {topic.attempted}</strong> correct
                    </span>
                    <span>·</span>
                    {/* Mini Accuracy bar */}
                    <div className="w-16 bg-[#182030] h-1.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          topic.accuracy >= 80
                            ? 'bg-emerald-500'
                            : topic.accuracy >= 60
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        )}
                        style={{ width: `${Math.max(8, topic.accuracy)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Practice Button */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onStartPracticeTopic) {
                        onStartPracticeTopic(topic.topicSlug, topic.subjectSlug)
                      }
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#181F30] hover:bg-[#20283C] text-white text-xs font-medium border border-[#283550] transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-zinc-300" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center bg-obsidian-800 rounded-2xl border border-obsidian-700 p-6 space-y-1">
              <p className="text-xs font-bold text-white">
                No topics in this filter
              </p>
              <p className="text-[11px] text-obsidian-400">
                Select another specialty filter above to review recall accuracy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Install Shortcut Modal */}
      <InstallShortcutModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  )
}
