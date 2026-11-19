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
        'sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-white/92 backdrop-blur-xl border-b border-[#E2E8F0] transition-all duration-200 flex items-center justify-between gap-2.5',
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
          <span className="text-[15px] sm:text-[16px] font-bold font-sans tracking-[-0.02em] text-[#053F5C]">
            Clinical
          </span>
          <span className="text-[15px] sm:text-[16px] font-bold font-sans tracking-[-0.02em] text-[#429EBD]">
            Recall
          </span>
        </div>
      </a>

      {/* Professional Search Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-[190px] sm:max-w-[240px] pl-2.5 pr-2 py-1.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl text-left flex items-center justify-between gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Search className="w-3.5 h-3.5 text-[#5C768D] group-hover:text-[#053F5C] transition-colors shrink-0 stroke-[2]" />
          <span className="text-xs text-[#5C768D] font-normal truncate">
            Search topics...
          </span>
        </div>

        <kbd className="text-[9px] font-mono text-[#5C768D] bg-[#EDF2F7] px-1 py-0.5 rounded border border-[#E2E8F0] hidden sm:inline shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Resident Profile Avatar Chip */}
      {user ? (
        <button
          type="button"
          onClick={onOpenProfile}
          title={`${user.name} (${user.targetExam || 'Resident'})`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#053F5C] text-white font-sans font-bold text-[10.5px] sm:text-[11px] flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-all cursor-pointer relative border border-[#084869]"
        >
          <span>{initials}</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#429EBD] ring-1.5 ring-white" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenProfile}
          className="py-1 px-2.5 rounded-xl bg-[#E2F3F8] hover:bg-[#C5E6F1] text-[#053F5C] text-xs font-semibold border border-[#C5E6F1] shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          Sign In
        </button>
      )}
    </header>
  )
}
