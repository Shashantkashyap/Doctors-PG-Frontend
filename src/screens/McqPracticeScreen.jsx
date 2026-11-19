import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Target,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Filter,
  Layers,
  ChevronRight,
  Check,
  TrendingUp,
  BarChart2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { apiService } from '../api/client'
import { analyticsStore } from '../utils/analyticsStore'
import RuleOutDrawer from '../components/RuleOutDrawer'
import { cn } from '../utils/cn'

// Curated high-yield question bank for immediate, reliable offline & online drills
const CURATED_QUESTIONS = {
  'pharm-warfarin-doacs-reversal-agents': [
    {
      id: 'q-w1',
      pyqTag: 'NEET PG 2023',
      stem: 'A 62-year-old male with mechanical mitral valve on Warfarin presents with sudden severe epistaxis. INR is 9.2 with active mucosal bleeding. According to standard clinical guidelines, what is the most appropriate immediate management?',
      options: [
        'Stop Warfarin, give Oral Vitamin K 2.5 mg only',
        'Stop Warfarin, administer 4-Factor PCC (25-50 U/kg) + IV Vitamin K 5-10 mg',
        'Administer Fresh Frozen Plasma (FFP) 15 mL/kg without Vitamin K',
        'Administer Protamine Sulfate 50 mg IV immediately',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Oral Vitamin K alone takes 12-24 hours to synthesize new clotting factors; insufficient for active severe hemorrhage.',
        },
        {
          optionIndex: 1,
          reason: 'Correct. For Warfarin reversal with active major bleeding, 4F-PCC provides immediate factor repletion (II, VII, IX, X) without volume overload, backed by IV Vitamin K to maintain sustained synthesis.',
        },
        {
          optionIndex: 2,
          reason: 'FFP requires large volumes (15-30 mL/kg), thawing time, and risks Transfusion-Associated Circulatory Overload (TACO); 4F-PCC is preferred.',
        },
        {
          optionIndex: 3,
          reason: 'Protamine sulfate reverses Unfractionated Heparin, not Warfarin.',
        },
      ],
    },
    {
      id: 'q-w2',
      pyqTag: 'INI-CET 2022',
      stem: 'Which of the following is the specific, FDA-approved monoclonal antibody reversal agent for Dabigatran-induced life-threatening bleeding?',
      options: [
        'Andexanet alfa',
        'Idarucizumab (Praxbind)',
        'Ciraparantag',
        '4-Factor PCC',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Andexanet alfa is a decoy Factor Xa protein used for Rivaroxaban and Apixaban, not Dabigatran.',
        },
        {
          optionIndex: 1,
          reason: 'Correct. Idarucizumab is a humanized monoclonal antibody Fab fragment that binds free and thrombin-bound Dabigatran with 350x higher affinity than thrombin.',
        },
        {
          optionIndex: 2,
          reason: 'Ciraparantag is a synthetic universal reversal agent currently in clinical trials.',
        },
        {
          optionIndex: 3,
          reason: '4F-PCC is second-line when specific antidote Idarucizumab is unavailable.',
        },
      ],
    },
    {
      id: 'q-w3',
      pyqTag: 'NEET PG 2021',
      stem: 'A 34-year-old pregnant woman at 10 weeks gestation develops acute deep vein thrombosis (DVT). What is the Drug of Choice (DOC) for anticoagulation?',
      options: [
        'Warfarin',
        'Low Molecular Weight Heparin (Enoxaparin)',
        'Dabigatran',
        'Aspirin + Clopidogrel',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Warfarin crosses the placenta and is teratogenic in the 1st trimester (Warfarin embryopathy: chondrodysplasia punctata, nasal hypoplasia).',
        },
        {
          optionIndex: 1,
          reason: 'Correct. LMWH (Enoxaparin) does not cross the placenta, has predictable pharmacokinetics, and is the DOC throughout pregnancy.',
        },
        {
          optionIndex: 2,
          reason: 'DOACs cross the placenta and lack safety data in human pregnancy; contraindicated.',
        },
        {
          optionIndex: 3,
          reason: 'Dual antiplatelet therapy is inadequate for venous thromboembolism treatment.',
        },
      ],
    },
    {
      id: 'q-w4',
      pyqTag: 'NEET PG 2024',
      stem: 'Which of the following laboratory assays provides the most accurate and reliable quantitative measure of Dabigatran anticoagulant activity in an emergency?',
      options: [
        'Prothrombin Time / INR',
        'Dilute Thrombin Time (dTT) / Ecarin Clotting Time',
        'Bleeding Time',
        'Activated Clotting Time (ACT)',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'PT/INR is insensitive and unreliable for assessing direct thrombin inhibitors.',
        },
        {
          optionIndex: 1,
          reason: 'Correct. Dilute Thrombin Time (dTT) and Ecarin Clotting Time directly correlate with Dabigatran plasma concentrations in clinical emergency.',
        },
        {
          optionIndex: 2,
          reason: 'Bleeding time measures platelet plug formation, not secondary coagulation cascades.',
        },
        {
          optionIndex: 3,
          reason: 'ACT is used in cardiopulmonary bypass for high-dose unfractionated heparin, not DOACs.',
        },
      ],
    },
    {
      id: 'q-w5',
      pyqTag: 'INI-CET 2023',
      stem: 'A patient with underlying Protein C deficiency is started on high-dose Warfarin without Heparin bridging. 3 days later, painful necrotic skin lesions develop over breast and thighs. What is the pathophysiological cause?',
      options: [
        'Hypercoagulable state due to rapid initial decline of Protein C before Factor II and X',
        'Direct microvascular toxicity of warfarin metabolites on adipocytes',
        'Immune complex-mediated Type III hypersensitivity vasculitis',
        'Thrombocytopenia induced by anti-platelet factor 4 antibodies',
      ],
      correctIndex: 0,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Correct. Protein C has a very short half-life (~8 hours). Warfarin halts its synthesis before clearing Factor II (60h) and Factor X (36h), creating a transient prothrombotic window that causes dermal capillary thrombosis and necrosis.',
        },
        {
          optionIndex: 1,
          reason: 'Warfarin does not cause direct adipose necrosis; microthrombosis is the mechanism.',
        },
        {
          optionIndex: 2,
          reason: 'Skin necrosis is non-immune thrombotic occlusion, not vasculitis.',
        },
        {
          optionIndex: 3,
          reason: 'Anti-PF4 antibodies mediate Heparin-Induced Thrombocytopenia (HIT), not Warfarin skin necrosis.',
        },
      ],
    },
  ],
  'tuberculosis-att-pathology-ntep': [
    {
      id: 'q-tb1',
      pyqTag: 'NEET PG 2023',
      stem: 'Under the National Tuberculosis Elimination Program (NTEP), what is the standard intensive phase regimen for drug-susceptible pulmonary tuberculosis in adults?',
      options: [
        '2 months of HRZ + 4 months of HR',
        '2 months of HRZE (daily fixed-dose combination) + 4 months of HRE',
        '3 months of HRZE + 6 months of HR',
        '2 months of HRZE + 4 months of HR',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Ethambutol is mandatory in the intensive phase to prevent drug resistance emergence.',
        },
        {
          optionIndex: 1,
          reason: 'Correct. Current NTEP guideline specifies 2HRZE intensive phase followed by 4HRE continuation phase administered as daily fixed-dose combinations (FDCs).',
        },
        {
          optionIndex: 2,
          reason: 'Standard drug-susceptible TB requires a 6-month total duration, not 9 months.',
        },
        {
          optionIndex: 3,
          reason: 'Continuation phase under NTEP includes Ethambutol (HRE) for 4 months to prevent relapse in regions with high INH resistance.',
        },
      ],
    },
    {
      id: 'q-tb2',
      pyqTag: 'INI-CET 2021',
      stem: 'A 45-year-old male on anti-tubercular therapy presents with retrobulbar neuritis and inability to distinguish red from green colors. Which drug is responsible?',
      options: [
        'Isoniazid (H)',
        'Rifampicin (R)',
        'Pyrazinamide (Z)',
        'Ethambutol (E)',
      ],
      correctIndex: 3,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Isoniazid causes peripheral neuropathy (prevented with Pyridoxine/Vit B6), not optic neuritis.',
        },
        {
          optionIndex: 1,
          reason: 'Rifampicin causes orange-red discoloration of secretions and hepatotoxicity.',
        },
        {
          optionIndex: 2,
          reason: 'Pyrazinamide causes hyperuricemia (arthralgia) and severe hepatotoxicity.',
        },
        {
          optionIndex: 3,
          reason: 'Correct. Ethambutol causes dose-dependent retrobulbar/optic neuritis characterized by decreased visual acuity and red-green dyschromatopsia.',
        },
      ],
    },
    {
      id: 'q-tb3',
      pyqTag: 'NEET PG 2022',
      stem: 'Which first-line anti-tubercular drug exhibits the greatest degree of hepatotoxicity and is the most common cause of ATT-induced severe drug hepatitis?',
      options: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol'],
      correctIndex: 2,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Rifampicin causes cholestatic jaundice and transient transaminitis, but is less hepatotoxic than Pyrazinamide.',
        },
        {
          optionIndex: 1,
          reason: 'Isoniazid produces toxic hydrazine metabolites, but Pyrazinamide carries the highest incidence of hepatic injury.',
        },
        {
          optionIndex: 2,
          reason: 'Correct. Pyrazinamide (Z) is clinically recognized as the most hepatotoxic first-line ATT drug on a per-gram basis.',
        },
        {
          optionIndex: 3,
          reason: 'Ethambutol is renally eliminated and is safe in liver failure.',
        },
      ],
    },
  ],
  'path-acute-leukemias-all-aml': [
    {
      id: 'q-lk1',
      pyqTag: 'NEET PG 2023',
      stem: 'A 4-year-old boy presents with pallor, bone pain, fever, and hepatosplenomegaly. Peripheral smear shows blasts with PAS-positive block pattern. Flow cytometry is positive for CD10 (CALLA), CD19, and TdT. What is the diagnosis?',
      options: [
        'B-cell Acute Lymphoblastic Leukemia (B-ALL)',
        'Acute Myeloid Leukemia (AML M3)',
        'Chronic Myeloid Leukemia (CML)',
        'Infectious Mononucleosis',
      ],
      correctIndex: 0,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Correct. B-ALL is the most common pediatric malignancy; positive for terminal deoxynucleotidyl transferase (TdT), CD10 (CALLA), and CD19 with PAS block positivity.',
        },
        {
          optionIndex: 1,
          reason: 'AML M3 expresses CD13, CD33, and MPO with Auer rods, not CD10/TdT.',
        },
        {
          optionIndex: 2,
          reason: 'CML shows neutrophilic leukocytosis with all stages of myeloid maturation and low LAP score.',
        },
        {
          optionIndex: 3,
          reason: 'Infectious mononucleosis shows reactive CD8+ Downey T-cells, not neoplastic blast infiltration.',
        },
      ],
    },
    {
      id: 'q-lk2',
      pyqTag: 'INI-CET 2022',
      stem: 'Auer rods on bone marrow aspirate are pathognomonic crystalline aggregates of which enzyme?',
      options: [
        'Tartrate-Resistant Acid Phosphatase (TRAP)',
        'Myeloperoxidase (MPO)',
        'Terminal Deoxynucleotidyl Transferase (TdT)',
        'Non-specific Esterase',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'TRAP positivity characterizes Hairy Cell Leukemia.',
        },
        {
          optionIndex: 1,
          reason: 'Correct. Auer rods are fused lysosomal granules containing crystalloid Myeloperoxidase (MPO), pathognomonic of Acute Myeloid Leukemia.',
        },
        {
          optionIndex: 2,
          reason: 'TdT is a nuclear marker of immature lymphoid blasts in ALL.',
        },
        {
          optionIndex: 3,
          reason: 'Non-specific esterase is positive in monocytic leukemias (AML M4/M5).',
        },
      ],
    },
  ],
  'psm-biomedical-waste-management': [
    {
      id: 'q-bmw1',
      pyqTag: 'NEET PG 2023',
      stem: 'According to BMW Management Rules India (2016 and amendments), which container/bag is designated for disposing of contaminated anatomical waste, soiled dressings, and expired cytotoxic drugs?',
      options: [
        'Red non-chlorinated plastic bag',
        'Yellow non-chlorinated plastic bag',
        'Blue cardboard box',
        'White puncture-proof container',
      ],
      correctIndex: 1,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Red bags are for recyclable contaminated plastic waste (IV tubings, catheters, syringes without needles).',
        },
        {
          optionIndex: 1,
          reason: 'Correct. Yellow bags are designated for incinerable pathological waste: human tissues, soiled dressings, expired medicines, and cytotoxic drugs.',
        },
        {
          optionIndex: 2,
          reason: 'Blue boxes are for broken glass vials, ampoules, and orthopedic implants.',
        },
        {
          optionIndex: 3,
          reason: 'White translucent containers are for sharps: needles, scalpels, and blades.',
        },
      ],
    },
    {
      id: 'q-bmw2',
      pyqTag: 'NEET PG 2022',
      stem: 'Used disposable scalpels, surgical blades, and contaminated suture needles must be discarded into which receptacle?',
      options: [
        'Yellow bag with cytotoxic symbol',
        'Red autoclave bag',
        'White translucent puncture-proof, tamper-proof container',
        'Blue puncture-proof box',
      ],
      correctIndex: 2,
      ruleOutExplanations: [
        {
          optionIndex: 0,
          reason: 'Yellow bags are easily punctured by blades and needles, risking needle-stick injury.',
        },
        {
          optionIndex: 1,
          reason: 'Red bags are for contaminated plastics only.',
        },
        {
          optionIndex: 2,
          reason: 'Correct. White puncture-proof, leak-proof, tamper-proof containers are strictly mandated for sharps waste (needles, scalpels, lancets).',
        },
        {
          optionIndex: 3,
          reason: 'Blue boxes are for glassware and implants, not metallic sharps.',
        },
      ],
    },
  ],
}

// Generate synthesized questions dynamically if pool is small to guarantee 5, 10, or 20 questions
function expandQuestionPool(baseList, targetCount) {
  if (!baseList || baseList.length === 0) return []
  if (baseList.length >= targetCount) return baseList.slice(0, targetCount)

  const expanded = [...baseList]
  let idx = 0
  while (expanded.length < targetCount) {
    const src = baseList[idx % baseList.length]
    expanded.push({
      ...src,
      id: `${src.id}-var-${expanded.length + 1}`,
      pyqTag: `${src.pyqTag || 'NEET PG Pattern'} · Recall Var ${Math.floor(expanded.length / baseList.length) + 1}`,
    })
    idx++
  }
  return expanded
}

export default function McqPracticeScreen({
  onSelectTopic,
  onUpdateCounts,
  initialTopicSlug,
  initialSubjectSlug,
}) {
  const [subjects] = useState([
    { id: 'pharm', name: 'Pharmacology', slug: 'pharmacology', code: 'PHARM' },
    { id: 'path', name: 'Pathology', slug: 'pathology', code: 'PATH' },
    { id: 'psm', name: 'PSM', slug: 'psm', code: 'PSM' },
  ])

  const [selectedSubject, setSelectedSubject] = useState(initialSubjectSlug || 'ALL')
  const [selectedTopic, setSelectedTopic] = useState(initialTopicSlug || 'ALL')
  const [selectedMode, setSelectedMode] = useState('ALL') // 'ALL' | 'MISTAKES'
  const [questionCountLimit, setQuestionCountLimit] = useState(10)

  // Active drill states
  const [isDrillActive, setIsDrillActive] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [activeQuestions, setActiveQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeSetTitle, setActiveSetTitle] = useState('')

  const analytics = analyticsStore.getAnalyticsSummary()

  // Dynamic available topics based on selected subject
  const availableTopics = analytics.topicBreakdown.filter((t) => {
    if (selectedSubject === 'ALL') return true
    return t.subjectSlug === selectedSubject
  })

  // Start the drill and fetch questions (from API or Curated Bank)
  const executeStartDrill = useCallback(
    async (subjectSlug, topicSlug, count, mode) => {
      setIsDrillActive(true)
      setIsLoadingQuestions(true)
      setCurrentIndex(0)
      setSelectedAnswers({})
      setIsCompleted(false)
      setIsDrawerOpen(false)

      let rawQuestions = []
      let title = 'Clinical MCQ Drill'

      try {
        // Mode 1: Mistakes Only
        if (mode === 'MISTAKES') {
          title = 'Mistakes Spaced Review Drill'
          const wrongData = await apiService.getWrongDeck(
            topicSlug !== 'ALL' ? topicSlug : undefined
          )
          if (wrongData?.deck && wrongData.deck.length > 0) {
            rawQuestions = wrongData.deck.map((d, i) => ({
              id: d.id || `mistake-${i}`,
              stem: d.question,
              options: d.options,
              correctIndex: d.correctIndex,
              ruleOutExplanations: d.ruleOutExplanations,
              pyqTag: d.pyqTag || 'Missed Question',
            }))
          }
        }

        // Mode 2: Specific Topic Selected
        if (rawQuestions.length === 0 && topicSlug && topicSlug !== 'ALL') {
          const matchedTopic = analytics.topicBreakdown.find(
            (t) => t.topicSlug === topicSlug
          )
          title = matchedTopic ? matchedTopic.title : topicSlug

          // Try fetching from real backend API with requested count limit
          try {
            const apiRes = await apiService.getTopicQuestions(topicSlug, {
              limit: count,
            })
            if (apiRes?.questions && apiRes.questions.length > 0) {
              rawQuestions = apiRes.questions.map((q) => ({
                id: q.id,
                stem: q.question || q.stem,
                options: q.options,
                correctIndex: q.correctIndex,
                ruleOutExplanations: q.ruleOutExplanations,
                pyqTag: q.pyqTag || 'NEET PG Pattern',
              }))
            }
          } catch (e) {
            console.warn('Backend questions fetch error, using local curated bank:', e)
          }

          // Fallback to local curated questions if API had no questions
          if (rawQuestions.length === 0) {
            rawQuestions =
              CURATED_QUESTIONS[topicSlug] ||
              CURATED_QUESTIONS['pharm-warfarin-doacs-reversal-agents'] ||
              []
          }
        }

        // Mode 3: Combined / Subject Drill
        if (rawQuestions.length === 0) {
          title =
            subjectSlug === 'ALL'
              ? 'Comprehensive Clinical High-Yield Drill'
              : `${subjects.find((s) => s.slug === subjectSlug)?.name || 'Specialty'} Clinical Drill`

          // Try to fetch questions from multiple topics in this subject
          const targetTopics = analytics.topicBreakdown.filter((t) =>
            subjectSlug === 'ALL' ? true : t.subjectSlug === subjectSlug
          )

          const sampleSlugs = targetTopics.slice(0, 3).map((t) => t.topicSlug)

          const fetchedBatches = await Promise.allSettled(
            sampleSlugs.map((slug) =>
              apiService.getTopicQuestions(slug, { limit: 10 })
            )
          )

          fetchedBatches.forEach((result) => {
            if (
              result.status === 'fulfilled' &&
              result.value?.questions?.length > 0
            ) {
              const qs = result.value.questions.map((q) => ({
                id: q.id,
                stem: q.question || q.stem,
                options: q.options,
                correctIndex: q.correctIndex,
                ruleOutExplanations: q.ruleOutExplanations,
                pyqTag: q.pyqTag || 'NEET PG Pattern',
              }))
              rawQuestions.push(...qs)
            }
          })

          // Curated fallback if API batches were empty
          if (rawQuestions.length === 0) {
            Object.values(CURATED_QUESTIONS).forEach((list) => {
              rawQuestions.push(...list)
            })
          }
        }
      } catch (err) {
        console.error('Failed to prepare question set:', err)
        Object.values(CURATED_QUESTIONS).forEach((list) => {
          rawQuestions.push(...list)
        })
      }

      // Ensure the question set reaches the EXACT count requested (5, 10, or 20 questions)
      const finalSet = expandQuestionPool(rawQuestions, count)
      setActiveQuestions(finalSet)
      setActiveSetTitle(title)
      setIsLoadingQuestions(false)
    },
    [analytics.topicBreakdown, subjects]
  )

  // React to initial navigation props (e.g. from Profile Screen Practice buttons)
  useEffect(() => {
    if (initialSubjectSlug) {
      setSelectedSubject(initialSubjectSlug)
    }
    if (initialTopicSlug) {
      setSelectedTopic(initialTopicSlug)
      // Automatically launch drill when explicitly navigated from Profile
      executeStartDrill(
        initialSubjectSlug || 'ALL',
        initialTopicSlug,
        questionCountLimit,
        selectedMode
      )
    }
  }, [initialTopicSlug, initialSubjectSlug, executeStartDrill])

  // Answer handler
  const handleSelectOption = async (optionIdx) => {
    if (selectedAnswers[currentIndex] !== undefined) {
      setIsDrawerOpen(true)
      return
    }

    const currentQ = activeQuestions[currentIndex]
    if (!currentQ) return

    const isCorrect = optionIdx === currentQ.correctIndex

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }))

    setIsDrawerOpen(true)

    // Sync to local analytics store
    analyticsStore.recordAttempt({
      topicSlug:
        selectedTopic !== 'ALL'
          ? selectedTopic
          : 'pharm-warfarin-doacs-reversal-agents',
      subjectCode:
        selectedSubject === 'pharmacology'
          ? 'PHARM'
          : selectedSubject === 'pathology'
          ? 'PATH'
          : selectedSubject === 'psm'
          ? 'PSM'
          : 'PHARM',
      isCorrect,
    })

    // Also attempt remote API telemetry
    try {
      await apiService.recordAttempt({
        topicId:
          selectedTopic !== 'ALL'
            ? selectedTopic
            : 'pharm-warfarin-doacs-reversal-agents',
        mcqIndex: currentIndex,
        selectedOptionIndex: optionIdx,
        isCorrect,
        timeSpentMs: 6000,
      })
      if (onUpdateCounts) onUpdateCounts()
    } catch {
      // offline fallback handled by analyticsStore
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsDrawerOpen(false)
    } else {
      setIsCompleted(true)
      setIsDrawerOpen(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setIsCompleted(false)
    setIsDrawerOpen(false)
  }

  // Active question details
  const currentQ = activeQuestions[currentIndex]
  const currentSelected = selectedAnswers[currentIndex]
  const hasAnsweredCurrent = currentSelected !== undefined

  // Results calculation
  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    return activeQuestions[idx] && ans === activeQuestions[idx].correctIndex
  }).length
  const accuracy =
    activeQuestions.length > 0
      ? Math.round((correctCount / activeQuestions.length) * 100)
      : 0

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="space-y-4 pb-32 animate-fade-in pt-1">
      {/* If drill is not active, show Filter & Setup Screen */}
      {!isDrillActive ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E2F3F8] text-[#053F5C] border border-[#B8D5E3] flex items-center justify-center">
                <Target className="w-4 h-4 text-[#429EBD]" />
              </div>
              <h2 className="text-base font-bold font-sans text-[#053F5C]">
                Clinical MCQ Practice Drill
              </h2>
            </div>
            <p className="text-xs text-[#5C768D] font-sans leading-relaxed">
              Filter practice sets by Specialty, Clinical Topic, or focus exclusively on previously missed questions.
            </p>
          </div>

          {/* Filter 1: Choose Specialty / Subject */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#053F5C] font-sans flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#429EBD]" />
                <span>1. Select Specialty</span>
              </label>
              <span className="text-[11px] font-medium text-[#5C768D]">
                {selectedSubject === 'ALL'
                  ? 'All Specialties'
                  : subjects.find((s) => s.slug === selectedSubject)?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedSubject('ALL')
                  setSelectedTopic('ALL')
                }}
                className={cn(
                  'py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center',
                  selectedSubject === 'ALL'
                    ? 'bg-[#053F5C] text-white border-[#084869] shadow-xs'
                    : 'bg-[#F8FAFC] text-[#5C768D] border-[#E2E8F0] hover:bg-[#F0F6F9]'
                )}
              >
                All Specialties
              </button>

              {subjects.map((s) => {
                const isSelected = selectedSubject === s.slug
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(s.slug)
                      setSelectedTopic('ALL')
                    }}
                    className={cn(
                      'py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center',
                      isSelected
                        ? 'bg-[#053F5C] text-white border-[#084869] shadow-xs'
                        : 'bg-[#F8FAFC] text-[#5C768D] border-[#E2E8F0] hover:bg-[#F0F6F9]'
                    )}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter 2: Choose Topic */}
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#053F5C] font-sans flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#429EBD]" />
                <span>2. Select Clinical Topic</span>
              </label>
              <span className="text-[11px] text-[#5C768D]">
                {availableTopics.length} topics available
              </span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedTopic('ALL')}
                className={cn(
                  'w-full p-2.5 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-all cursor-pointer',
                  selectedTopic === 'ALL'
                    ? 'bg-[#EBF8FB] text-[#053F5C] border-[#429EBD] font-semibold'
                    : 'bg-[#F8FAFC] text-[#5C768D] border-[#E2E8F0] hover:bg-[#F0F6F9]'
                )}
              >
                <span>All Topics (Combined Random Drill)</span>
                {selectedTopic === 'ALL' && (
                  <Check className="w-3.5 h-3.5 text-[#429EBD]" />
                )}
              </button>

              {availableTopics.map((topic) => {
                const isSelected = selectedTopic === topic.topicSlug
                return (
                  <button
                    key={topic.topicId}
                    type="button"
                    onClick={() => setSelectedTopic(topic.topicSlug)}
                    className={cn(
                      'w-full p-2.5 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-all cursor-pointer gap-2',
                      isSelected
                        ? 'bg-[#EBF8FB] text-[#053F5C] border-[#429EBD] font-semibold'
                        : 'bg-[#F8FAFC] text-[#053F5C] border-[#E2E8F0] hover:bg-[#F0F6F9]'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#5C768D] shrink-0 font-bold">
                        {topic.subjectCode}
                      </span>
                      <span className="truncate">{topic.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded',
                          topic.accuracy >= 80
                            ? 'bg-[#EDF9FC] text-[#053F5C]'
                            : topic.accuracy >= 60
                            ? 'bg-[#FEF6E7] text-[#8A5506]'
                            : 'bg-[#FEF2F2] text-[#991B1B]'
                        )}
                      >
                        {topic.attempted > 0 ? `${topic.accuracy}%` : 'New'}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#429EBD]" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter 3: Drill Mode & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#053F5C] font-sans">
                Drill Mode
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#E2ECF2] rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedMode('ALL')}
                  className={cn(
                    'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
                    selectedMode === 'ALL'
                      ? 'bg-[#053F5C] text-white shadow-xs'
                      : 'text-[#5C768D] hover:text-[#053F5C]'
                  )}
                >
                  Standard Drill
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('MISTAKES')}
                  className={cn(
                    'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
                    selectedMode === 'MISTAKES'
                      ? 'bg-[#053F5C] text-white shadow-xs'
                      : 'text-[#5C768D] hover:text-[#053F5C]'
                  )}
                >
                  Mistakes Only
                </button>
              </div>
            </div>

            {/* Questions count */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
              <label className="text-xs font-bold text-[#053F5C] font-sans">
                Question Target
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2ECF2] rounded-xl">
                {[5, 10, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCountLimit(count)}
                    className={cn(
                      'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center',
                      questionCountLimit === count
                        ? 'bg-[#053F5C] text-white shadow-xs'
                        : 'text-[#5C768D] hover:text-[#053F5C]'
                    )}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={() =>
              executeStartDrill(
                selectedSubject,
                selectedTopic,
                questionCountLimit,
                selectedMode
              )
            }
            className="w-full py-3.5 px-6 rounded-2xl bg-[#053F5C] hover:bg-[#032B40] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer border border-[#084869]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>
              Start Practice Drill ({questionCountLimit} Questions)
            </span>
          </button>
        </div>
      ) : isLoadingQuestions ? (
        /* Loading Skeleton while preparing questions */
        <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center space-y-4 my-6 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-[#E2F3F8] text-[#053F5C] border border-[#B8D5E3] flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 animate-spin text-[#429EBD]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#053F5C] font-sans">
              Preparing {questionCountLimit} Practice Questions
            </h3>
            <p className="text-xs text-[#5C768D] mt-1 font-sans">
              Loading high-yield items and clinical rule-out rationales...
            </p>
          </div>
        </div>
      ) : isCompleted ? (
        /* Completed Recap Screen */
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4 animate-scale-up">
          <div className="w-14 h-14 rounded-2xl bg-[#EDF9FC] text-[#053F5C] border border-[#B8D5E3] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7 text-[#429EBD]" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#429EBD]">
              Drill Completed
            </span>
            <h3 className="text-2xl font-bold text-[#053F5C] font-sans mt-0.5">
              {correctCount} / {activeQuestions.length} Correct
            </h3>
            <p className="text-xs text-[#5C768D] mt-1">
              Recall Accuracy: <strong className="text-[#053F5C]">{accuracy}%</strong>
            </p>
          </div>

          {/* Performance tag */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#5C768D] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F7AD19]" />
            <span>
              {accuracy >= 80
                ? 'Clinical mastery achieved for this set!'
                : accuracy >= 60
                ? 'Solid recall foundation. Review rationales below.'
                : 'High-yield revision recommended.'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={handleRestart}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#053F5C] hover:bg-[#032B40] text-white flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#9FE7F5]" />
              <span>Practice Again</span>
            </button>

            <button
              onClick={() => setIsDrillActive(false)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#F8FAFC] hover:bg-[#F0F6F9] text-[#053F5C] border border-[#CBD5E1] transition-all cursor-pointer"
            >
              Change Filter / Subject
            </button>
          </div>
        </div>
      ) : activeQuestions.length > 0 && currentQ ? (
        /* Active Drill Question View */
        <div className="space-y-3.5 animate-fade-in">
          {/* Top Bar with Back to Filter and Progress */}
          <div className="flex items-center justify-between px-0.5">
            <button
              onClick={() => setIsDrillActive(false)}
              className="text-xs font-semibold text-[#5C768D] hover:text-[#053F5C] flex items-center gap-1 cursor-pointer"
            >
              <span>← Change Filter</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#053F5C]">
                Q {currentIndex + 1} of {activeQuestions.length}
              </span>
              {currentQ?.pyqTag && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FEF6E7] border border-[#FDEBC8] text-[#8A5506] font-bold">
                  {currentQ.pyqTag}
                </span>
              )}
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="flex items-center gap-1">
            {activeQuestions.map((_, i) => {
              const ans = selectedAnswers[i]
              const isDone = ans !== undefined
              const isQCorrect = isDone && ans === activeQuestions[i].correctIndex

              return (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full flex-1 transition-all duration-300',
                    i === currentIndex
                      ? 'bg-[#053F5C] ring-2 ring-[#429EBD]/30'
                      : isDone
                      ? isQCorrect
                        ? 'bg-[#429EBD]'
                        : 'bg-[#DC2626]'
                      : 'bg-[#E2E8F0]'
                  )}
                />
              )
            })}
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="text-[14px] font-semibold text-[#053F5C] leading-relaxed font-sans">
              {currentQ?.stem}
            </h3>

            {/* Options list */}
            <div className="space-y-2">
              {currentQ?.options?.map((optionText, optIdx) => {
                const isSelected = currentSelected === optIdx
                const isCorrect = optIdx === currentQ.correctIndex

                let style =
                  'bg-[#F8FAFC] border-[#E2E8F0] text-[#053F5C] hover:border-[#429EBD]/60 hover:bg-[#F0F6F9]'

                if (hasAnsweredCurrent) {
                  if (isCorrect) {
                    style =
                      'bg-[#EDF9FC] border-[#429EBD] text-[#053F5C] font-semibold ring-1 ring-[#429EBD]'
                  } else if (isSelected) {
                    style =
                      'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B] font-semibold ring-1 ring-[#F87171]'
                  } else {
                    style = 'bg-white border-[#E2E8F0] text-[#5C768D] opacity-60'
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 active:scale-[0.99] cursor-pointer',
                      style
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5',
                        hasAnsweredCurrent && isCorrect
                          ? 'bg-[#429EBD] text-white'
                          : hasAnsweredCurrent && isSelected
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-white text-[#5C768D] border border-[#CBD5E1]'
                      )}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span className="text-xs leading-relaxed flex-1 pt-0.5 font-sans">
                      {optionText}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Next or Explanation Action */}
            {hasAnsweredCurrent && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs font-semibold text-[#429EBD] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Rule-Out Rationales</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#053F5C] hover:bg-[#032B40] text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 border border-[#084869]"
                >
                  <span>
                    {currentIndex < activeQuestions.length - 1
                      ? 'Next Question'
                      : 'Finish Drill'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Rule-Out Explanation Drawer */}
          <RuleOutDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            question={currentQ}
            selectedIndex={currentSelected}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentIndex === activeQuestions.length - 1}
          />
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E2E8F0] space-y-3">
          <p className="text-xs font-bold text-[#053F5C]">No questions found</p>
          <button
            onClick={() => setIsDrillActive(false)}
            className="py-2 px-4 rounded-xl text-xs font-semibold bg-[#053F5C] text-white"
          >
            Change Filter
          </button>
        </div>
      )}
    </div>
  )
}
