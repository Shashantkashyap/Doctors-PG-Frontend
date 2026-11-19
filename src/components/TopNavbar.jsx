import React from 'react'
import { Search } from 'lucide-react'
import { LogoIcon } from './Logo'
import { cn } from '../utils/cn'

export default function TopNavbar({
  onOpenSearch,
  className,
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-white/92 backdrop-blur-xl border-b border-[#E2E8F0] transition-all duration-200 flex items-center justify-between gap-3',
        className
      )}
    >
      {/* Brand & Official Logo Lockup */}
      <a
        href="/"
        className="flex items-center gap-2 shrink-0 group active:scale-[0.98] transition-transform"
      >
        <LogoIcon className="w-8 h-8 shadow-xs rounded-xl shrink-0 transition-transform group-hover:scale-105" />

        <div className="flex items-baseline gap-0.5">
          <span className="text-[16px] font-bold font-sans tracking-[-0.02em] text-[#053F5C]">
            Clinical
          </span>
          <span className="text-[16px] font-bold font-sans tracking-[-0.02em] text-[#429EBD]">
            Recall
          </span>
        </div>
      </a>

      {/* Spacious, Professional Search Bar */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-[260px] pl-3 pr-2.5 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] hover:border-[#429EBD]/60 rounded-xl text-left flex items-center justify-between gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-3.5 h-3.5 text-[#5C768D] group-hover:text-[#053F5C] transition-colors shrink-0 stroke-[2]" />
          <span className="text-xs text-[#5C768D] font-normal truncate">
            Search topics, drugs, protocols...
          </span>
        </div>

        <kbd className="text-[9px] font-mono text-[#5C768D] bg-[#EDF2F7] px-1.5 py-0.5 rounded border border-[#E2E8F0] hidden sm:inline shrink-0">
          ⌘K
        </kbd>
      </button>
    </header>
  )
}
