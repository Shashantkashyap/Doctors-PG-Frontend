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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../api/client'
import { analyticsStore } from '../utils/analyticsStore'
import { cn } from '../utils/cn'

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
  const [analytics, setAnalytics] = useState(() =>
    analyticsStore.getAnalyticsSummary()
  )

  useEffect(() => {
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

            let updatedTopics = prev.topicBreakdown
            if (Array.isArray(res.topicProgressList) && res.topicProgressList.length > 0) {
              const remoteMap = new Map(res.topicProgressList.map((p) => [p.topicSlug, p]))
              updatedTopics = prev.topicBreakdown.map((t) => {
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
        return 'text-[#053F5C] bg-[#E2F3F8] border-[#B8D5E3]'
      case 'PATH':
        return 'text-[#8A5506] bg-[#FEF6E7] border-[#FDEBC8]'
      case 'PSM':
        return 'text-[#1D576A] bg-[#EDF9FC] border-[#B8E5F0]'
      default:
        return 'text-[#053F5C] bg-[#F8FAFC] border-[#E2E8F0]'
    }
  }

  const getAccuracyBadge = (accuracy, attempted) => {
    if (attempted === 0) {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#5C768D]">
          Unattempted
        </span>
      )
    }
    if (accuracy >= 80) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EDF9FC] border border-[#9FE7F5] text-[#053F5C] flex items-center gap-1">
          <Check className="w-2.5 h-2.5 text-[#429EBD]" />
          <span>{accuracy}% · Mastered</span>
        </span>
      )
    }
    if (accuracy >= 60) {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FEF6E7] border border-[#FDEBC8] text-[#8A5506]">
          {accuracy}% · Solid
        </span>
      )
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] flex items-center gap-1">
        <AlertTriangle className="w-2.5 h-2.5 text-[#DC2626]" />
        <span>{accuracy}% · Needs Revision</span>
      </span>
    )
  }

  return (
    <div className="space-y-4 pb-32 animate-fade-in pt-1">
      {/* 1. Doctor Profile Hero Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-[#053F5C] text-white font-sans font-bold text-lg flex items-center justify-center shadow-xs border border-[#084869] shrink-0">
                {initials}
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#429EBD] ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold font-sans text-[#053F5C] truncate">
                  {user.name}
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E2F3F8] text-[#053F5C] border border-[#B8D5E3]">
                  MD Resident
                </span>
              </div>
              <p className="text-xs text-[#5C768D] truncate font-sans mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-xl text-[#8A9BA8] hover:text-[#991B1B] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Target Examination Switcher */}
        <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-medium text-[#5C768D] font-sans">
              Target Examination
            </span>
            <span className="text-[11px] font-semibold text-[#429EBD] font-sans">
              {user.targetExam?.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2ECF2] rounded-lg">
            {EXAMS.map((exam) => {
              const isSelected = user.targetExam === exam.id
              return (
                <button
                  key={exam.id}
                  onClick={() => handleExamChange(exam.id)}
                  disabled={isUpdatingExam}
                  className={cn(
                    'py-1.5 px-2 text-[11px] font-semibold font-sans rounded-md transition-all cursor-pointer active:scale-95 text-center',
                    isSelected
                      ? 'bg-[#053F5C] text-white shadow-xs'
                      : 'text-[#5C768D] hover:text-[#053F5C] hover:bg-white/60'
                  )}
                >
                  {exam.label}
                </button>
              )
            })}
          </div>

          {successNote && (
            <div className="text-[11px] font-medium text-[#053F5C] bg-[#EDF9FC] border border-[#9FE7F5] p-1.5 rounded-lg text-center flex items-center justify-center gap-1 animate-fade-in">
              <Check className="w-3 h-3 text-[#429EBD]" />
              <span>{successNote}</span>
            </div>
          )}
        </div>

        {/* Cloud Sync Status */}
        <div className="flex items-center justify-between px-1 text-xs text-[#5C768D]">
          <span>Cloud Telemetry Sync</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#429EBD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#429EBD] animate-pulse" />
            Live & Active
          </span>
        </div>
      </div>

      {/* 2. Overall Accuracy & Performance Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5C768D] mb-1">
            <span className="font-medium text-[11px]">Overall Accuracy</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#429EBD]" />
          </div>
          <p className="text-xl font-bold font-sans text-[#053F5C]">
            {analytics.overall.overallAccuracy}%
          </p>
          <p className="text-[10px] text-[#5C768D] mt-0.5">
            {analytics.overall.totalCorrect} / {analytics.overall.totalAttempted} Correct
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5C768D] mb-1">
            <span className="font-medium text-[11px]">Questions Done</span>
            <Target className="w-3.5 h-3.5 text-[#053F5C]" />
          </div>
          <p className="text-xl font-bold font-sans text-[#053F5C]">
            {analytics.overall.totalAttempted}
          </p>
          <p className="text-[10px] text-[#5C768D] mt-0.5">
            Across 3 Specialties
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5C768D] mb-1">
            <span className="font-medium text-[11px]">Cards Mastered</span>
            <Award className="w-3.5 h-3.5 text-[#F7AD19]" />
          </div>
          <p className="text-xl font-bold font-sans text-[#053F5C]">
            {analytics.overall.masteredCount}
          </p>
          <p className="text-[10px] text-[#5C768D] mt-0.5">
            ≥80% Recall Rate
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5C768D] mb-1">
            <span className="font-medium text-[11px]">Topics Tracked</span>
            <BookOpen className="w-3.5 h-3.5 text-[#429EBD]" />
          </div>
          <p className="text-xl font-bold font-sans text-[#053F5C]">
            {analytics.overall.totalTopicsTracked}
          </p>
          <p className="text-[10px] text-[#5C768D] mt-0.5">
            High-Yield Syllabus
          </p>
        </div>
      </div>

      {/* 3. Subject-Wise Accuracy Analysis */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between px-0.5">
          <h3 className="text-sm font-bold text-[#053F5C] font-sans flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#429EBD]" />
            <span>Specialty-Wise Accuracy</span>
          </h3>
          <span className="text-[11px] text-[#5C768D] font-sans">
            Subject performance
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {analytics.subjectBreakdown.map((subj) => (
            <div
              key={subj.code}
              className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border',
                      getSubjectBadgeStyle(subj.code)
                    )}
                  >
                    {subj.code}
                  </span>
                  <h4 className="text-sm font-bold text-[#053F5C] font-sans mt-1">
                    {subj.name}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-[#053F5C] font-sans">
                    {subj.accuracy}%
                  </span>
                  <p className="text-[10px] text-[#5C768D]">
                    {subj.correct}/{subj.attempted} Qs
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E2ECF2] h-2 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    subj.accuracy >= 75
                      ? 'bg-[#429EBD]'
                      : subj.accuracy >= 60
                      ? 'bg-[#053F5C]'
                      : 'bg-[#F7AD19]'
                  )}
                  style={{ width: `${subj.accuracy}%` }}
                />
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  if (onStartPracticeSubject) {
                    onStartPracticeSubject(subj.slug)
                  }
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EDF9FC] text-[#053F5C] hover:text-[#429EBD] text-[11px] font-semibold border border-[#E2E8F0] hover:border-[#B8D5E3] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <span>Practice {subj.name}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Topic-Wise Detailed Breakdown */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-0.5">
          <div>
            <h3 className="text-sm font-bold text-[#053F5C] font-sans flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F7AD19]" />
              <span>Topic-Wise Clinical Retention</span>
            </h3>
            <p className="text-[11px] text-[#5C768D] font-sans">
              Accuracy and mastery status per clinical topic
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PHARM', label: 'Pharma' },
              { id: 'PATH', label: 'Patho' },
              { id: 'PSM', label: 'PSM' },
              { id: 'WEAK', label: 'Weak (<70%)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTopicFilter(f.id)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer',
                  topicFilter === f.id
                    ? 'bg-[#053F5C] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#5C768D] hover:text-[#053F5C] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-2">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px]">
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
                    onClick={() => onSelectTopic(topic.topicSlug)}
                    className="text-left font-semibold text-[13px] text-[#053F5C] hover:text-[#429EBD] transition-colors leading-snug cursor-pointer line-clamp-1"
                  >
                    {topic.title}
                  </button>

                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#5C768D]">
                    <span>
                      Recall: <strong className="text-[#053F5C]">{topic.correct} / {topic.attempted}</strong> correct
                    </span>
                    <span>·</span>
                    {/* Mini Accuracy bar */}
                    <div className="w-16 bg-[#E2ECF2] h-1.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          topic.accuracy >= 80
                            ? 'bg-[#429EBD]'
                            : topic.accuracy >= 60
                            ? 'bg-[#053F5C]'
                            : 'bg-[#DC2626]'
                        )}
                        style={{ width: `${topic.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Practice Button */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      if (onStartPracticeTopic) {
                        onStartPracticeTopic(topic.topicSlug, topic.subjectSlug)
                      }
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#E2F3F8] hover:bg-[#C5E6F1] text-[#053F5C] text-xs font-semibold border border-[#B8D5E3] transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3 text-[#429EBD]" />
                    <span>Practice</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-1">
              <p className="text-xs font-bold text-[#053F5C]">
                No topics in this filter
              </p>
              <p className="text-[11px] text-[#5C768D]">
                Select another specialty filter above to review recall accuracy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
