import React, { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'
import BottomNav from './components/BottomNav'
import ExploreScreen from './screens/ExploreScreen'
import TopicScreen from './screens/TopicScreen'
import NotebookScreen from './screens/NotebookScreen'
import MistakesDeckScreen from './screens/MistakesDeckScreen'
import SearchScreen from './screens/SearchScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileModal from './components/ProfileModal'
import { LogoIcon } from './components/Logo'
import { apiService } from './api/client'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(() => {
    return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('profile') === 'true'
  })
  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '')
    if (path === 'notebook' || path === 'mistakes') return path
    return 'explore'
  })
  const [currentTopicSlug, setCurrentTopicSlug] = useState(() => {
    const match = window.location.pathname.match(/^\/topic\/(.+)/)
    return match ? match[1] : null
  })
  const [isSearchOpen, setIsSearchOpen] = useState(() => {
    return window.location.pathname === '/search'
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
          if (path === 'notebook' || path === 'mistakes') {
            setActiveTab(path)
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

  const navigateToTopic = (slug) => {
    setIsSearchOpen(false)
    setCurrentTopicSlug(slug)
    window.history.pushState({ topicSlug: slug }, '', `/topic/${slug}`)
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
    window.history.pushState({ tab: activeTab }, '', '/')
    refreshCounters()
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setCurrentTopicSlug(null)
    setIsSearchOpen(false)
    window.history.pushState({ tab: tabId }, '', `/${tabId === 'explore' ? '' : tabId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    refreshCounters()
  }

  // 1. Initial Session Verification Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#053F5C] flex items-center justify-center shadow-md shadow-[#053F5C]/15 mb-4 animate-pulse">
          <LogoIcon className="w-9 h-9" />
        </div>
        <div className="w-5 h-5 border-2 border-[#C5E6F1] border-t-[#429EBD] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#5C768D] font-inter mt-3">Restoring resident session...</p>
      </div>
    )
  }

  // 2. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => refreshCounters()} />
  }

  // 3. Authenticated App Experience
  return (
    <div className="min-h-screen bg-[#EAEFF4] text-[#053F5C] flex flex-col items-center justify-start selection:bg-[#C5E6F1] selection:text-[#053F5C] font-sans">
      {/* Mobile-First App Shell (Max 430px iPhone 16 Pro width) */}
      <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFC] sm:border-x sm:border-[#E2E8F0] sm:shadow-[0_20px_50px_-15px_rgba(5,63,92,0.08)] flex flex-col relative px-4 scroll-touch">
        {/* Offline Pill Alert */}
        {!isOnline && (
          <div className="sticky top-2 z-50 py-1.5 px-3.5 bg-[#053F5C] text-white rounded-full text-xs font-medium flex items-center justify-center gap-2 shadow-float mx-auto w-fit animate-fade-in border border-[#429EBD]/30">
            <WifiOff className="w-3.5 h-3.5 text-[#F7AD19]" />
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
              onBack={handleBackToExplore}
              onAttemptDone={refreshCounters}
            />
          ) : activeTab === 'explore' ? (
            <ExploreScreen
              onSelectTopic={navigateToTopic}
              onOpenSearch={handleOpenSearch}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          ) : activeTab === 'notebook' ? (
            <NotebookScreen
              onSelectTopic={navigateToTopic}
              onUpdateCounts={(count) => setNotebookCount(count)}
            />
          ) : activeTab === 'mistakes' ? (
            <MistakesDeckScreen
              onSelectTopic={navigateToTopic}
              onUpdateCounts={(count) => setWrongCount(count)}
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

        {/* Resident Profile Slide-over Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </div>
  )
}
