import React from 'react'
import { Home, Layers, Target, Bookmark, User } from 'lucide-react'
import { cn } from '../utils/cn'

export default function BottomNav({ activeTab, setActiveTab, wrongCount = 0, notebookCount = 0 }) {
  const tabs = [
    {
      id: 'explore',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: Layers,
      badge: null,
    },
    {
      id: 'mcqs',
      label: 'MCQs',
      icon: Target,
      badge: wrongCount > 0 ? wrongCount : null,
    },
    {
      id: 'notebook',
      label: 'Saved',
      icon: Bookmark,
      badge: notebookCount > 0 ? notebookCount : null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      badge: null,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="w-full max-w-[430px] mx-auto px-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2 bg-obsidian-900/95 backdrop-blur-2xl border-t border-obsidian-700/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pointer-events-auto">
        <nav className="flex items-center justify-between gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive =
              activeTab === tab.id ||
              (tab.id === 'mcqs' && activeTab === 'mistakes')

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.96] cursor-pointer',
                  isActive
                    ? 'bg-obsidian-800 text-white font-semibold shadow-xs border border-obsidian-600'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-850 font-medium'
                )}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] transition-transform duration-150',
                      isActive ? 'stroke-[2.2] text-cliniq-pharm' : 'stroke-[1.8]'
                    )}
                  />
                  {!isActive && tab.badge !== null && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 text-[9px] font-bold bg-cliniq-trap text-obsidian-950 rounded-full flex items-center justify-center shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={cn('text-[10.5px] tracking-tight', isActive ? 'font-bold text-white' : 'font-medium text-obsidian-400')}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
