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
        'sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#E8E4DA] transition-all duration-200 flex items-center justify-between gap-2.5',
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
          <span className="text-[15px] sm:text-[16px] font-bold font-sans tracking-[-0.02em] text-[#161B18]">
            Clinical
          </span>
          <span className="text-[15px] sm:text-[16px] font-bold font-sans tracking-[-0.02em] text-[#2E5740]">
            Recall
          </span>
        </div>
      </a>

      {/* Professional Search Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-[190px] sm:max-w-[240px] pl-2.5 pr-2 py-1.5 bg-[#FDFCF9] hover:bg-[#F5F2EB] border border-[#E5E0D5] hover:border-[#D5CFBF] rounded-xl text-left flex items-center justify-between gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Search className="w-3.5 h-3.5 text-[#87928A] group-hover:text-[#5C6860] transition-colors shrink-0 stroke-[2]" />
          <span className="text-xs text-[#87928A] font-normal truncate">
            Search topics...
          </span>
        </div>

        <kbd className="text-[9px] font-mono text-[#717E75] bg-[#F4F0E8] px-1 py-0.5 rounded border border-[#E0DACE] hidden sm:inline shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Resident Profile Avatar Chip */}
      {user ? (
        <button
          type="button"
          onClick={onOpenProfile}
          title={`${user.name} (${user.targetExam || 'Resident'})`}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#1A3626] text-[#FAF8F5] font-sans font-bold text-[10.5px] sm:text-[11px] flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-all cursor-pointer relative border border-[#234532]"
        >
          <span>{initials}</span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#527E64] ring-1.5 ring-[#FAF8F5]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenProfile}
          className="py-1 px-2.5 rounded-xl bg-[#E2ECE5] hover:bg-[#C5D8CC] text-[#1A3626] text-xs font-semibold border border-[#C5D8CC] shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          Sign In
        </button>
      )}
    </header>
  )
}
