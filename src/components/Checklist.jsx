import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  BookOpen,
} from 'lucide-react'
import { cn } from '../utils/cn'

// Lightweight helper to render markdown tables and bullet lines cleanly without huge heavy dependencies
function MarkdownDomainRenderer({ content = '' }) {
  if (!content) return null

  // Split into paragraphs or table blocks
  const lines = content.split('\n')
  const blocks = []
  let tableRows = []
  let inTable = false

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      // Skip separator rows like |---|---|
      if (!trimmed.match(/^\|[\s-:]+\|$/)) {
        const cells = trimmed
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
        tableRows.push(cells)
      }
    } else {
      if (inTable && tableRows.length > 0) {
        blocks.push({ type: 'table', rows: [...tableRows] })
        tableRows = []
        inTable = false
      }
      if (trimmed.startsWith('###')) {
        blocks.push({ type: 'h3', text: trimmed.replace(/^###\s*/, '') })
      } else if (trimmed.startsWith('##')) {
        blocks.push({ type: 'h2', text: trimmed.replace(/^##\s*/, '') })
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({ type: 'bullet', text: trimmed.replace(/^[-*]\s*/, '') })
      } else if (trimmed.length > 0) {
        blocks.push({ type: 'p', text: trimmed })
      }
    }
  })

  if (inTable && tableRows.length > 0) {
    blocks.push({ type: 'table', rows: tableRows })
  }

  return (
    <div className="space-y-2 text-xs text-obsidian-200 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h3 key={i} className="text-xs sm:text-sm font-bold text-white pt-2 border-b border-obsidian-700 pb-1">
              {block.text}
            </h3>
          )
        }
        if (block.type === 'h3') {
          return (
            <h4 key={i} className="text-xs font-bold text-blue-400 pt-1">
              {block.text}
            </h4>
          )
        }
        if (block.type === 'table') {
          const [header, ...bodyRows] = block.rows
          return (
            <div key={i} className="overflow-x-auto my-2 rounded-xl border border-obsidian-700 bg-obsidian-850">
              <table className="w-full text-left border-collapse text-xs">
                {header && (
                  <thead>
                    <tr className="bg-obsidian-750 border-b border-obsidian-700">
                      {header.map((col, cIdx) => (
                        <th key={cIdx} className="p-2.5 font-bold text-white border-r border-obsidian-700 last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="divide-y divide-obsidian-700/60">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-obsidian-800 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-obsidian-200 border-r border-obsidian-700/60 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        if (block.type === 'bullet') {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className="text-blue-400 mt-0.5">•</span>
              <span className="flex-1">{block.text}</span>
            </div>
          )
        }
        return (
          <p key={i} className="text-obsidian-300">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

export default function Checklist({ checklist = [] }) {
  const [openSections, setOpenSections] = useState({ 0: true, 1: true })
  const [checkedMap, setCheckedMap] = useState({})

  if (!checklist || checklist.length === 0) {
    return (
      <div className="py-16 text-center text-obsidian-400">
        <p className="text-xs">Clinical knowledge base is in editorial preparation.</p>
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

  return (
    <div className="space-y-3 pb-20 animate-fade-in">
      {/* Controls & Domain Progress Header */}
      <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#20283C] shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-blue-400 stroke-[2] shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-white">
              10-Minute Knowledge Base ({checklist.length} Domains)
            </h3>
            <span className="text-[10px] text-zinc-400 font-medium">
              Structured clinical checklist & comparative tables
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className="text-zinc-400 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer"
          >
            Expand
          </button>
          <span className="text-zinc-600">·</span>
          <button
            onClick={collapseAll}
            className="text-zinc-400 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Accordion Cards for 6 Domains */}
      <div className="space-y-2">
        {checklist.map((section, idx) => {
          const isOpen = Boolean(openSections[idx])
          const bullets = section.bullets || []
          const hasMarkdown = Boolean(section.contentMarkdown)

          return (
            <div
              key={idx}
              className={cn(
                'rounded-2xl border transition-all duration-150 overflow-hidden bg-[#121622]',
                isOpen
                  ? 'border-blue-500/35 shadow-xs'
                  : 'border-[#20283C] hover:border-[#2D3850]'
              )}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(idx)}
                className="w-full p-3.5 flex items-center justify-between text-left transition-colors active:bg-obsidian-750 gap-2 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-[13px] font-bold text-white leading-snug break-words">
                    {section.domain}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-obsidian-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-obsidian-400" />
                  )}
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-2 border-t border-obsidian-700/80">
                  {/* Rich Markdown with Tables */}
                  {hasMarkdown && (
                    <MarkdownDomainRenderer content={section.contentMarkdown} />
                  )}

                  {/* Interactive bullets if present */}
                  {bullets && bullets.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {bullets.map((bullet, bIdx) => {
                        const isChecked = Boolean(checkedMap[`${idx}-${bIdx}`])
                        return (
                          <div
                            key={bIdx}
                            onClick={() => toggleBullet(idx, bIdx)}
                            className={cn(
                              'p-2 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed transition-all cursor-pointer select-none active:scale-[0.99]',
                              isChecked
                                ? 'bg-emerald-500/10 text-obsidian-500 line-through'
                                : 'hover:bg-obsidian-750 text-obsidian-200 font-medium'
                            )}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-cliniq-psm" />
                              ) : (
                                <Circle className="w-4 h-4 text-obsidian-500 hover:text-cliniq-pharm transition-colors" />
                              )}
                            </div>
                            <span className="flex-1 break-words">{bullet}</span>
                          </div>
                        )
                      })}
                    </div>
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
