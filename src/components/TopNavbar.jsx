import React from 'react'
import { Search } from 'lucide-react'
import { LogoIcon } from './Logo'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

export default function TopNavbar({
  onOpenSearch,
  onOpenProfile,
  className,
}) {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name
        .replace(/^(Dr\.|Dr)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DR'

  return (
    <header
      className={cn(
        'sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-[#F2F4F8]/90 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-200 flex items-center justify-between gap-2.5',
        className
      )}
    >
      {/* Brand & Official Logo Lockup */}
      <a
        href="/"
        className="flex items-center gap-1.5 shrink-0 group active:scale-[0.98] transition-transform"
      >
        <LogoIcon className="w-7 h-7 sm:w-8 sm:h-8 shadow-xs rounded-xl shrink-0 transition-transform group-hover:scale-105" />

        <div className="flex items-baseline gap-0.5">
          <span className="text-[15px] sm:text-[16px] font-bold font-outfit tracking-[-0.02em] text-[#111D35]">
            Clinical
          </span>
          <span className="text-[15px] sm:text-[16px] font-bold font-outfit tracking-[-0.02em] text-[#2869E8]">
            Recall
          </span>
        </div>
      </a>

      {/* Professional Search Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-[190px] sm:max-w-[240px] pl-2.5 pr-2 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl text-left flex items-center justify-between gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 stroke-[2]" />
          <span className="text-xs text-slate-400 font-normal truncate">
            Search topics...
          </span>
        </div>

        <kbd className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded border border-slate-200/70 hidden sm:inline shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Resident Profile Avatar Chip */}
      {user ? (
        <button
          type="button"
          onClick={onOpenProfile}
          title={`${user.name} (${user.targetExam || 'Resident'})`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-outfit font-bold text-[10.5px] sm:text-[11px] flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-all cursor-pointer relative"
        >
          <span>{initials}</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenProfile}
          className="py-1 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          Sign In
        </button>
      )}
    </header>
  )
}
