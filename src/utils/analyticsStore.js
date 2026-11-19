/**
 * Clinical Analytics & MCQ Progress Store
 * Tracks subject-wise and topic-wise accuracy, attempts, and streaks.
 * Synchronizes with localStorage and API telemetry.
 */

const STORAGE_KEY = 'medrecall_analytics_v1'

// Default baseline high-yield topics with initial clinical telemetry
export const DEFAULT_TOPICS_METRICS = [
  // Pharmacology
  {
    topicId: 'pharm-1',
    topicSlug: 'pharm-warfarin-doacs-reversal-agents',
    title: 'Warfarin & DOAC Protocols (Reversals & INR)',
    subjectCode: 'PHARM',
    subjectName: 'Pharmacology',
    subjectSlug: 'pharmacology',
    totalAvailable: 20,
    attempted: 10,
    correct: 8,
    lastAttemptedAt: '2026-11-18T10:30:00.000Z',
  },
  {
    topicId: 'pharm-2',
    topicSlug: 'tuberculosis-att-pathology-ntep',
    title: 'Tuberculosis: ATT Pharmacology & NTEP Regimens',
    subjectCode: 'PHARM',
    subjectName: 'Pharmacology',
    subjectSlug: 'pharmacology',
    totalAvailable: 20,
    attempted: 10,
    correct: 7,
    lastAttemptedAt: '2026-11-17T15:20:00.000Z',
  },
  {
    topicId: 'pharm-3',
    topicSlug: 'pharm-drugs-in-pregnancy-pediatrics-geriatrics-lactation',
    title: 'Drugs in Pregnancy, Pediatrics & Geriatrics',
    subjectCode: 'PHARM',
    subjectName: 'Pharmacology',
    subjectSlug: 'pharmacology',
    totalAvailable: 20,
    attempted: 8,
    correct: 6,
    lastAttemptedAt: '2026-11-16T12:00:00.000Z',
  },

  // Pathology
  {
    topicId: 'path-1',
    topicSlug: 'path-acute-leukemias-all-aml',
    title: 'Acute Leukemias (ALL vs AML Translocations)',
    subjectCode: 'PATH',
    subjectName: 'Pathology',
    subjectSlug: 'pathology',
    totalAvailable: 20,
    attempted: 10,
    correct: 7,
    lastAttemptedAt: '2026-11-18T18:00:00.000Z',
  },
  {
    topicId: 'path-2',
    topicSlug: 'path-amyloidosis',
    title: 'Amyloidosis: Congo Red & Fibril Pathology',
    subjectCode: 'PATH',
    subjectName: 'Pathology',
    subjectSlug: 'pathology',
    totalAvailable: 20,
    attempted: 8,
    correct: 5,
    lastAttemptedAt: '2026-11-17T11:10:00.000Z',
  },

  // PSM / Community Medicine
  {
    topicId: 'psm-1',
    topicSlug: 'psm-biomedical-waste-management',
    title: 'Biomedical Waste Management Color Codes',
    subjectCode: 'PSM',
    subjectName: 'PSM',
    subjectSlug: 'psm',
    totalAvailable: 20,
    attempted: 10,
    correct: 7,
    lastAttemptedAt: '2026-11-18T19:30:00.000Z',
  },
  {
    topicId: 'psm-2',
    topicSlug: 'psm-contraception-spacing-terminal-emergency',
    title: 'Contraception (Spacing, Terminal, Emergency)',
    subjectCode: 'PSM',
    subjectName: 'PSM',
    subjectSlug: 'psm',
    totalAvailable: 20,
    attempted: 8,
    correct: 5,
    lastAttemptedAt: '2026-11-17T14:15:00.000Z',
  },
]

export const analyticsStore = {
  // Load saved state or default
  getAllTopicMetrics() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // fallback
    }
    // Initialize with default baseline
    this.saveAllTopicMetrics(DEFAULT_TOPICS_METRICS)
    return DEFAULT_TOPICS_METRICS
  },

  saveAllTopicMetrics(metrics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
    } catch (e) {
      console.warn('Failed to save analytics to localStorage:', e)
    }
  },

  // Record a new attempt dynamically
  recordAttempt({ topicId, topicSlug, topicTitle, subjectCode, isCorrect }) {
    const metrics = this.getAllTopicMetrics()
    let existing = metrics.find(
      (m) =>
        (topicId && m.topicId === topicId) ||
        (topicSlug && m.topicSlug === topicSlug)
    )

    if (existing) {
      existing.attempted = (existing.attempted || 0) + 1
      if (isCorrect) {
        existing.correct = (existing.correct || 0) + 1
      }
      existing.lastAttemptedAt = new Date().toISOString()
    } else {
      // Add new topic record
      const code = subjectCode || 'PHARM'
      const name =
        code === 'PHARM'
          ? 'Pharmacology'
          : code === 'PATH'
          ? 'Pathology'
          : code === 'PSM'
          ? 'PSM'
          : 'Clinical'

      metrics.push({
        topicId: topicId || `topic-${Date.now()}`,
        topicSlug: topicSlug || 'clinical-topic',
        title: topicTitle || 'Clinical Protocol',
        subjectCode: code,
        subjectName: name,
        subjectSlug: name.toLowerCase(),
        totalAvailable: 10,
        attempted: 1,
        correct: isCorrect ? 1 : 0,
        lastAttemptedAt: new Date().toISOString(),
      })
    }

    this.saveAllTopicMetrics(metrics)
    return this.getAnalyticsSummary()
  },

  // Compute full subject-wise and topic-wise analytics summary
  getAnalyticsSummary() {
    const topics = this.getAllTopicMetrics()

    let totalAttempted = 0
    let totalCorrect = 0
    let masteredCount = 0

    // Group by Subject
    const subjectMap = {
      PHARM: {
        code: 'PHARM',
        name: 'Pharmacology',
        slug: 'pharmacology',
        color: '#053F5C',
        badgeBg: '#E2F3F8',
        attempted: 0,
        correct: 0,
        topicsCount: 0,
      },
      PATH: {
        code: 'PATH',
        name: 'Pathology',
        slug: 'pathology',
        color: '#8A5506',
        badgeBg: '#FEF6E7',
        attempted: 0,
        correct: 0,
        topicsCount: 0,
      },
      PSM: {
        code: 'PSM',
        name: 'PSM (Community Medicine)',
        slug: 'psm',
        color: '#1D576A',
        badgeBg: '#EDF9FC',
        attempted: 0,
        correct: 0,
        topicsCount: 0,
      },
    }

    // Enhance topics with accuracy and status
    const topicBreakdown = topics.map((t) => {
      const accuracy =
        t.attempted > 0 ? Math.round((t.correct / t.attempted) * 100) : 0
      totalAttempted += t.attempted || 0
      totalCorrect += t.correct || 0

      if (accuracy >= 80 && t.attempted >= 5) {
        masteredCount++
      }

      // Group into subject
      const subj = subjectMap[t.subjectCode] || subjectMap.PHARM
      subj.attempted += t.attempted || 0
      subj.correct += t.correct || 0
      subj.topicsCount += 1

      let status = 'Unattempted'
      let statusType = 'neutral'
      if (t.attempted > 0) {
        if (accuracy >= 80) {
          status = 'Mastered'
          statusType = 'high'
        } else if (accuracy >= 60) {
          status = 'Solid'
          statusType = 'medium'
        } else {
          status = 'Needs Revision'
          statusType = 'low'
        }
      }

      return {
        ...t,
        accuracy,
        status,
        statusType,
      }
    })

    // Compute subject accuracies
    const subjectBreakdown = Object.values(subjectMap).map((subj) => {
      const accuracy =
        subj.attempted > 0
          ? Math.round((subj.correct / subj.attempted) * 100)
          : 0
      let status = 'Unattempted'
      if (subj.attempted > 0) {
        if (accuracy >= 75) status = 'Strong'
        else if (accuracy >= 60) status = 'Moderate'
        else status = 'Needs Drill'
      }

      return {
        ...subj,
        accuracy,
        status,
      }
    })

    const overallAccuracy =
      totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

    return {
      overall: {
        totalAttempted,
        totalCorrect,
        overallAccuracy,
        masteredCount,
        totalTopicsTracked: topics.length,
      },
      subjectBreakdown,
      topicBreakdown,
    }
  },
}
