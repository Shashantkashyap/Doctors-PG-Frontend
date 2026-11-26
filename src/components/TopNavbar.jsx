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
        'sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-obsidian-900/95 backdrop-blur-xl border-b border-obsidian-700/80 transition-all duration-200 flex items-center justify-between gap-3',
        className
      )}
    >
      {/* Brand & ClinIQ Logo Lockup */}
      <a
        href="/"
        className="flex items-center gap-2.5 shrink-0 group active:scale-[0.98] transition-transform"
      >
        <LogoFull className="h-8 w-auto" />
      </a>

      {/* Spacious, Professional Obsidian Search Trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="flex-1 max-w-[240px] pl-3 pr-2.5 py-1.5 bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 hover:border-cliniq-pharm/50 rounded-xl text-left flex items-center justify-between gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-3.5 h-3.5 text-obsidian-400 group-hover:text-cliniq-pharm transition-colors shrink-0 stroke-[2]" />
          <span className="text-xs text-obsidian-300 font-normal truncate">
            Search 234 topics, DOCs...
          </span>
        </div>

        <kbd className="text-[9px] font-mono text-obsidian-400 bg-obsidian-700/70 px-1.5 py-0.5 rounded border border-obsidian-600 hidden sm:inline shrink-0">
          ⌘K
        </kbd>
      </button>
    </header>
  )
}
