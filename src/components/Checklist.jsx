import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { cn } from '../utils/cn'

export default function Checklist({ checklist = [] }) {
  const [openSections, setOpenSections] = useState({ 0: true, 1: true })
  const [checkedMap, setCheckedMap] = useState({})

  if (!checklist || checklist.length === 0) {
    return (
      <div className="py-16 text-center text-slate-400">
        <p className="text-xs">Clinical checklist is in editorial preparation.</p>
      </div>
    )
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleBullet = (sIdx, bIdx) => {
    const key = `${sIdx}-${bIdx}`
    setCheckedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const expandAll = () => {
    const all = {}
    checklist.forEach((_, i) => {
      all[i] = true
    })
    setOpenSections(all)
  }

  const collapseAll = () => {
    setOpenSections({})
  }

  // Calculate total progress
  let totalBullets = 0
  let totalChecked = 0
  checklist.forEach((sec, sIdx) => {
    sec.bullets?.forEach((_, bIdx) => {
      totalBullets++
      if (checkedMap[`${sIdx}-${bIdx}`]) totalChecked++
    })
  })

  return (
    <div className="space-y-3 pb-20 animate-fade-in">
      {/* Controls & Overall Progress Header */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E2F3F8] text-[#053F5C] border border-[#C5E6F1] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2] text-[#429EBD]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#053F5C]">
              Clinical Domains ({checklist.length})
            </h3>
            <span className="text-[10px] text-[#5C768D] font-medium">
              {totalChecked} of {totalBullets} items reviewed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className="text-[#5C768D] hover:text-[#053F5C] transition-colors text-[11px] font-semibold cursor-pointer"
          >
            Expand
          </button>
          <span className="text-[#E2E8F0]">·</span>
          <button
            onClick={collapseAll}
            className="text-[#5C768D] hover:text-[#053F5C] transition-colors text-[11px] font-semibold cursor-pointer"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Inset Accordion Cards */}
      <div className="space-y-2">
        {checklist.map((section, idx) => {
          const isOpen = Boolean(openSections[idx])
          const bullets = section.bullets || []
          const domainCheckedCount = bullets.filter((_, bIdx) => checkedMap[`${idx}-${bIdx}`]).length
          const isDomainComplete = bullets.length > 0 && domainCheckedCount === bullets.length

          return (
            <div
              key={idx}
              className={cn(
                'rounded-2xl border transition-all duration-150 overflow-hidden bg-white',
                isOpen
                  ? 'border-[#9FE7F5] shadow-xs'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              )}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(idx)}
                className="w-full p-3.5 flex items-center justify-between text-left transition-colors active:bg-[#F0F6F9] gap-2 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#053F5C] leading-snug break-words">
                    {section.domain}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isDomainComplete ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2F3F8] text-[#053F5C] border border-[#C5E6F1]">
                      Done
                    </span>
                  ) : domainCheckedCount > 0 ? (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F0F6F9] text-[#053F5C] border border-[#E1ECF2]">
                      {domainCheckedCount}/{bullets.length}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-[#889DA8]">
                      {bullets.length}
                    </span>
                  )}

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#889DA8]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#889DA8]" />
                  )}
                </div>
              </button>

              {/* Accordion Body: Interactive bullets */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-1.5 border-t border-[#E2E8F0]">
                  {bullets && bullets.length > 0 ? (
                    bullets.map((bullet, bIdx) => {
                      const isChecked = Boolean(checkedMap[`${idx}-${bIdx}`])
                      return (
                        <div
                          key={bIdx}
                          onClick={() => toggleBullet(idx, bIdx)}
                          className={cn(
                            'p-2 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed transition-all cursor-pointer select-none active:scale-[0.99]',
                            isChecked
                              ? 'bg-[#EBF8FB]/60 text-[#889DA8] line-through'
                              : 'hover:bg-[#F0F6F9] text-[#183B4E] font-medium'
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-[#429EBD]" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#CBD5E1] hover:text-[#429EBD] transition-colors" />
                            )}
                          </div>
                          <span className="flex-1 break-words">{bullet}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-xs text-[#889DA8] italic">No items recorded.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
