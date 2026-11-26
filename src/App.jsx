import React, { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'
import BottomNav from './components/BottomNav'
import ExploreScreen from './screens/ExploreScreen'
import SubjectsScreen from './screens/SubjectsScreen'
import TopicScreen from './screens/TopicScreen'
import NotebookScreen from './screens/NotebookScreen'
import McqPracticeScreen from './screens/McqPracticeScreen'
import ProfileScreen from './screens/ProfileScreen'
import SearchScreen from './screens/SearchScreen'
import LoginScreen from './screens/LoginScreen'
import { LogoIcon } from './components/Logo'
import { apiService } from './api/client'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '')
    if (path === 'subjects' || path === 'notebook' || path === 'mcqs' || path === 'mistakes' || path === 'profile') {
      return path === 'mistakes' ? 'mcqs' : path
    }
    return 'explore'
  })
  const [currentTopicSlug, setCurrentTopicSlug] = useState(() => {
    const match = window.location.pathname.match(/^\/topic\/(.+)/)
    return match ? match[1] : null
  })
  const [isSearchOpen, setIsSearchOpen] = useState(() => {
    return window.location.pathname === '/search'
  })
  const [mcqPracticeConfig, setMcqPracticeConfig] = useState({
    topicSlug: null,
    subjectSlug: null,
  })
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [notebookCount, setNotebookCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      refreshCounters()
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const handlePopState = (e) => {
      if (window.location.pathname === '/search' || e.state?.search) {
        setIsSearchOpen(true)
      } else {
        setIsSearchOpen(false)
        const match = window.location.pathname.match(/^\/topic\/(.+)/)
        if (match) {
          setCurrentTopicSlug(match[1])
        } else if (e.state?.topicSlug) {
          setCurrentTopicSlug(e.state.topicSlug)
        } else {
          setCurrentTopicSlug(null)
          const path = window.location.pathname.replace(/^\//, '')
          if (path === 'subjects' || path === 'notebook' || path === 'mcqs' || path === 'mistakes' || path === 'profile') {
            setActiveTab(path === 'mistakes' ? 'mcqs' : path)
          } else if (e.state?.tab) {
            setActiveTab(e.state.tab)
          } else {
            setActiveTab('explore')
          }
        }
      }
    }
    window.addEventListener('popstate', handlePopState)

    // Keyboard shortcut: Cmd+K or Ctrl+K opens search
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  const refreshCounters = () => {
    apiService
      .getNotebook()
      .then((data) => {
        if (data?.bookmarks) setNotebookCount(data.bookmarks.length)
      })
      .catch(() => {})

    apiService
      .getWrongDeck()
      .then((data) => {
        if (data?.deck) setWrongCount(data.deck.length)
      })
      .catch(() => {})
  }

  const [topicInitialLayer, setTopicInitialLayer] = useState('wardCard')

  const navigateToTopic = (slug, layer = 'wardCard') => {
    setIsSearchOpen(false)
    setCurrentTopicSlug(slug)
    setTopicInitialLayer(layer)
    const query = layer && layer !== 'wardCard' ? `?layer=${layer}` : ''
    window.history.pushState({ topicSlug: slug, layer }, '', `/topic/${slug}${query}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenSearch = () => {
    setIsSearchOpen(true)
    window.history.pushState({ search: true }, '', '/search')
  }

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
    if (window.location.pathname === '/search') {
      window.history.pushState({ tab: activeTab }, '', `/${activeTab === 'explore' ? '' : activeTab}`)
    }
  }

  const handleBackToExplore = () => {
    setCurrentTopicSlug(null)
    setIsSearchOpen(false)
    window.history.pushState({ tab: activeTab }, '', `/${activeTab === 'explore' ? '' : activeTab}`)
    refreshCounters()
  }

  const handlePracticeTopicFromProfile = (topicSlug, subjectSlug) => {
    setMcqPracticeConfig({ topicSlug, subjectSlug })
    setActiveTab('mcqs')
    setCurrentTopicSlug(null)
    setIsSearchOpen(false)
    window.history.pushState({ tab: 'mcqs' }, '', '/mcqs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePracticeSubjectFromProfile = (subjectSlug) => {
    setMcqPracticeConfig({ topicSlug: 'ALL', subjectSlug })
    setActiveTab('mcqs')
    setCurrentTopicSlug(null)
    setIsSearchOpen(false)
    window.history.pushState({ tab: 'mcqs' }, '', '/mcqs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setCurrentTopicSlug(null)
    setIsSearchOpen(false)
    if (tabId !== 'mcqs') {
      setMcqPracticeConfig({ topicSlug: null, subjectSlug: null })
    }
    window.history.pushState({ tab: tabId }, '', `/${tabId === 'explore' ? '' : tabId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    refreshCounters()
  }

  // 1. Initial Session Verification Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <LogoIcon className="w-8 h-8" />
        </div>
        <div className="w-5 h-5 border-2 border-obsidian-700 border-t-cliniq-pharm rounded-full animate-spin" />
        <p className="text-xs font-semibold text-obsidian-400 mt-3">Restoring resident session...</p>
      </div>
    )
  }

  // 2. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => refreshCounters()} />
  }

  // 3. Authenticated App Experience
  return (
    <div className="min-h-screen bg-obsidian-950 text-white flex flex-col items-center justify-start selection:bg-cliniq-pharm/30 selection:text-white font-sans">
      {/* Mobile-First App Shell (Max 430px iPhone 16 Pro width) */}
      <div className="w-full max-w-[430px] min-h-screen bg-obsidian-900 sm:border-x sm:border-obsidian-700/80 sm:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] flex flex-col relative px-4 scroll-touch">
        {/* Offline Pill Alert */}
        {!isOnline && (
          <div className="sticky top-2 z-50 py-1.5 px-3.5 bg-obsidian-800 text-white rounded-full text-xs font-medium flex items-center justify-center gap-2 shadow-float mx-auto w-fit animate-fade-in border border-amber-500/30">
            <WifiOff className="w-3.5 h-3.5 text-cliniq-trap" />
            <span>Offline mode · Cached clinical cards available</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {isSearchOpen ? (
            <SearchScreen
              onClose={handleCloseSearch}
              onSelectTopic={navigateToTopic}
            />
          ) : currentTopicSlug ? (
            <TopicScreen
              topicSlug={currentTopicSlug}
              initialLayer={topicInitialLayer}
              onBack={handleBackToExplore}
              onAttemptDone={refreshCounters}
            />
          ) : activeTab === 'explore' ? (
            <ExploreScreen
              onSelectTopic={navigateToTopic}
              onOpenSearch={handleOpenSearch}
            />
          ) : activeTab === 'subjects' ? (
            <SubjectsScreen
              onSelectTopic={navigateToTopic}
            />
          ) : activeTab === 'mcqs' || activeTab === 'mistakes' ? (
            <McqPracticeScreen
              onSelectTopic={navigateToTopic}
              onUpdateCounts={refreshCounters}
              initialTopicSlug={mcqPracticeConfig.topicSlug}
              initialSubjectSlug={mcqPracticeConfig.subjectSlug}
              wrongCount={wrongCount}
            />
          ) : activeTab === 'notebook' ? (
            <NotebookScreen
              onSelectTopic={navigateToTopic}
              onUpdateCounts={(count) => setNotebookCount(count)}
            />
          ) : activeTab === 'profile' ? (
            <ProfileScreen
              onSelectTopic={navigateToTopic}
              onStartPracticeSubject={handlePracticeSubjectFromProfile}
              onStartPracticeTopic={handlePracticeTopicFromProfile}
            />
          ) : null}
        </main>

        {/* Bottom Floating Navigation Dock */}
        {!currentTopicSlug && !isSearchOpen && (
          <BottomNav
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            wrongCount={wrongCount}
            notebookCount={notebookCount}
          />
        )}
      </div>
    </div>
  )
}
