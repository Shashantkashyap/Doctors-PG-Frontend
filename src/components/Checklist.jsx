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
      <div className="p-3.5 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E2ECE5] text-[#1A3626] border border-[#C5D8CC] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2] text-[#2E5740]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#161B18]">
              Clinical Domains ({checklist.length})
            </h3>
            <span className="text-[10px] text-[#717E75] font-medium">
              {totalChecked} of {totalBullets} items reviewed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className="text-[#5C6860] hover:text-[#161B18] transition-colors text-[11px] font-semibold"
          >
            Expand
          </button>
          <span className="text-[#DDD6C8]">·</span>
          <button
            onClick={collapseAll}
            className="text-[#5C6860] hover:text-[#161B18] transition-colors text-[11px] font-semibold"
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
                'rounded-2xl border transition-all duration-150 overflow-hidden bg-[#FDFCF9]',
                isOpen
                  ? 'border-[#D5CFBF] shadow-xs'
                  : 'border-[#E5E0D5] hover:border-[#D5CFBF]'
              )}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(idx)}
                className="w-full p-3.5 flex items-center justify-between text-left transition-colors active:bg-[#F5F2EB] gap-2"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#161B18] leading-snug break-words">
                    {section.domain}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isDomainComplete ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2ECE5] text-[#1A3626] border border-[#C5D8CC]">
                      Done
                    </span>
                  ) : domainCheckedCount > 0 ? (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F2EFE8] text-[#2F3731] border border-[#E5E0D5]">
                      {domainCheckedCount}/{bullets.length}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-medium text-[#87928A]">
                      {bullets.length}
                    </span>
                  )}

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#87928A]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#87928A]" />
                  )}
                </div>
              </button>

              {/* Accordion Body: Interactive bullets */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-1.5 border-t border-[#EAE5DB]">
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
                              ? 'bg-[#F2F6F3]/70 text-[#87928A] line-through'
                              : 'hover:bg-[#F5F2EB] text-[#202622] font-medium'
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-[#2E5740]" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#C5D0C7] hover:text-[#717E75] transition-colors" />
                            )}
                          </div>
                          <span className="flex-1 break-words">{bullet}</span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-xs text-[#87928A] italic">No items recorded.</p>
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
