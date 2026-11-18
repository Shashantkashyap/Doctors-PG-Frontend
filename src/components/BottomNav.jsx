import React from 'react'
import { Compass, Bookmark, Target } from 'lucide-react'
import { cn } from '../utils/cn'

export default function BottomNav({ activeTab, setActiveTab, wrongCount = 0, notebookCount = 0 }) {
  const tabs = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      badge: null,
    },
    {
      id: 'notebook',
      label: 'Notebook',
      icon: Bookmark,
      badge: notebookCount > 0 ? notebookCount : null,
    },
    {
      id: 'mistakes',
      label: 'MCQs',
      icon: Target,
      badge: wrongCount > 0 ? wrongCount : null,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="w-full max-w-[430px] mx-auto px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-2 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(15,23,42,0.06)] pointer-events-auto">
        <nav className="flex items-center justify-between gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.96] cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 font-medium'
                )}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] transition-transform duration-150',
                      isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'
                    )}
                  />
                  {!isActive && tab.badge !== null && (
                    <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 text-[9px] font-semibold bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className={cn('text-xs tracking-tight', isActive ? 'font-semibold' : 'font-medium')}>
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
