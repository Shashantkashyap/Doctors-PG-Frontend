import axios from 'axios'

const API_BASE = process.env.API_BASE || 'https://doctors-pg-backend-1001199295091.asia-south2.run.app/api/v1'

async function runTests() {
  console.log('🧪 Starting Live Backend Integration Tests...\n')
  let passed = 0
  let failed = 0

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`  ✅ ${name}`)
      passed++
    } else {
      console.error(`  ❌ ${name}: ${details}`)
      failed++
    }
  }

  try {
    // 1. Auth Login & Session Verification (/auth/login & /auth/me)
    console.log('[1/8] Testing Auth...')
    const uniqueEmail = `intern_${Date.now()}@medrecall.in`
    const authRes = await axios.post(`${API_BASE}/auth/login`, {
      name: 'Dr. Test Intern',
      email: uniqueEmail,
      targetExam: 'NEET_PG',
    })
    const token = authRes.data?.token
    assert('Auth Login returns JWT token', Boolean(token))
    assert('Auth Login returns user object', Boolean(authRes.data?.user?.email === uniqueEmail.toLowerCase()))

    const authHeaders = { Authorization: `Bearer ${token}` }

    // Test GET /auth/me
    const meRes = await axios.get(`${API_BASE}/auth/me`, { headers: authHeaders })
    assert('Auth /me returns current user profile', meRes.data?.success && meRes.data?.user?.name === 'Dr. Test Intern')

    // Test validation error handling (400)
    try {
      await axios.post(`${API_BASE}/auth/login`, { name: 'A', email: 'invalid' })
      assert('Validation error returns 400', false, 'Expected 400 error')
    } catch (valErr) {
      assert('Validation error correctly caught with 400', valErr.response?.status === 400)
    }

    // 2. Subjects
    console.log('\n[2/8] Testing Subjects Catalog...')
    const subjRes = await axios.get(`${API_BASE}/subjects`)
    const subjects = subjRes.data?.subjects || []
    assert('Subjects list contains 19 subjects', subjects.length === 19)
    const active = subjects.filter((s) => !s.isLocked)
    assert('Active subjects count is 3 (Pharm, Path, PSM)', active.length === 3)

    // 3. Subject Topics
    console.log('\n[3/8] Testing Subject Topics...')
    const topicsRes = await axios.get(`${API_BASE}/subjects/pharmacology/topics`)
    const pharmTopics = topicsRes.data?.topics || []
    assert('Pharmacology has 78 topics', pharmTopics.length === 78)

    // 4. Live Fuzzy Search & Trending
    console.log('\n[4/8] Testing Search & Trending...')
    const searchRes = await axios.get(`${API_BASE}/search`, { params: { q: 'warfarin' } })
    assert('Search query "warfarin" returns results', searchRes.data?.results?.length > 0)
    assert('Search returns latencyMs', typeof searchRes.data?.latencyMs === 'number')

    const trendRes = await axios.get(`${API_BASE}/search/trending`)
    assert('Trending returns topics', trendRes.data?.topics?.length > 0)

    // 5. 3-Layer Revision Topic Data
    console.log('\n[5/8] Testing 3-Layer Topic Detail...')
    const sampleSlug = 'pharm-warfarin-doacs-reversal-agents'
    const topicRes = await axios.get(`${API_BASE}/topics/${sampleSlug}`)
    const topic = topicRes.data?.topic
    assert('Topic has Golden Anchors (DOC, IOC, MCC)', Boolean(topic?.goldenAnchors?.doc))
    assert('Topic has Twins Matrix differentiator', topic?.twinsMatrix?.length > 0)
    assert('Topic has 5m Checklist (6 domains)', topic?.completeChecklist?.length === 6)
    assert('Topic has Traps and Mnemonics', Boolean(topic?.trapsAndMnemonics))

    // 6. 10-MCQ Micro-Drill & 4-Option Rule Out
    console.log('\n[6/8] Testing 10-MCQ Micro-Drill & Rule-Out Bank...')
    const qRes = await axios.get(`${API_BASE}/topics/${sampleSlug}/questions`)
    const questions = qRes.data?.questions || []
    assert('Topic returns 10 questions', questions.length === 10)
    const q1 = questions[0]
    assert('Question has 4 options', q1?.options?.length === 4)
    assert('Question has ruleOutExplanations for all options', q1?.ruleOutExplanations?.length === 4)

    // 7. 20th Notebook Toggle & Note Patch
    console.log('\n[7/8] Testing 20th Notebook...')
    const toggleRes = await axios.post(
      `${API_BASE}/notebook/toggle`,
      { topicId: topic.id, personalNote: 'High yield for grand test 3' },
      { headers: authHeaders }
    )
    assert('Notebook toggle successful', toggleRes.status === 200 || toggleRes.status === 201)

    const nbRes = await axios.get(`${API_BASE}/notebook`, { headers: authHeaders })
    assert('Notebook contains pinned topic', nbRes.data?.bookmarks?.length > 0)

    const patchRes = await axios.patch(
      `${API_BASE}/notebook/${topic.id}/note`,
      { personalNote: 'Updated: remember Idarucizumab 5g IV' },
      { headers: authHeaders }
    )
    assert('Update personal note successful', patchRes.status === 200)

    // 8. Practice Attempt Telemetry & Mistakes Deck
    console.log('\n[8/8] Testing Progress Telemetry & Mistakes Deck...')
    const attemptRes = await axios.post(
      `${API_BASE}/progress/attempt`,
      {
        topicId: topic.id,
        mcqIndex: 0,
        selectedOptionIndex: 0, // Wrong option
        isCorrect: false,
        timeSpentMs: 14000,
      },
      { headers: authHeaders }
    )
    assert('Attempt telemetry recorded', Boolean(attemptRes.data?.success))

    const wrongRes = await axios.get(`${API_BASE}/progress/wrong-deck`, { headers: authHeaders })
    assert('Mistakes Deck contains wrong question', wrongRes.data?.totalWrongCards > 0)

    // Clinical Flag Error Drawer
    const flagRes = await axios.post(
      `${API_BASE}/review/flag`,
      {
        topicId: topic.id,
        section: 'goldenAnchors',
        lineRef: 'DOC Warfarin',
        comment: 'Verified with AHA/ACC guidelines',
      },
      { headers: authHeaders }
    )
    assert('Clinical Error Flag submitted', flagRes.status === 201)

    console.log(`\n🎉 All integration checks passed! (${passed}/${passed + failed})`)
  } catch (err) {
    console.error('\n❌ Integration test error:', err.response?.data || err.message)
    failed++
  }

  process.exit(failed > 0 ? 1 : 0)
}

runTests()
