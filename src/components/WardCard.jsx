import React, { useState } from 'react'
import {
  Clock,
  GitCompare,
} from 'lucide-react'
import { cn } from '../utils/cn'

export default function WardCard({ topic }) {
  if (!topic) return null

  const {
    goldenAnchors = {},
    twinsMatrix = [],
    trapsAndMnemonics = {},
  } = topic

  const [activeTwinIndex, setActiveTwinIndex] = useState(0)

  const formatAnchorText = (text) => {
    if (!text) return null
    if (typeof text !== 'string') return [JSON.stringify(text)]
    if (text.includes('|')) {
      return text.split('|').map((part) => part.trim()).filter(Boolean)
    }
    return [text]
  }

  const docItems = formatAnchorText(goldenAnchors?.doc)
  const iocItems = formatAnchorText(goldenAnchors?.ioc)
  const mccItems = formatAnchorText(goldenAnchors?.mcc)

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* 1. THREE GOLDEN ANCHORS (DOC, IOC, MCC) */}
      <div className="space-y-3">
        {/* DOC: Drug of Choice */}
        {docItems && docItems.length > 0 && (
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#053F5C] shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                  Drug of Choice (DOC)
                </h3>
                <span className="text-xs font-semibold text-[#053F5C]">First-line medical therapy</span>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0] text-xs">
              {docItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 first:pt-1 last:pb-0 text-[#183B4E] leading-relaxed font-medium break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IOC: Investigation of Choice */}
        {iocItems && iocItems.length > 0 && (
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#429EBD] shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                  Investigation of Choice (IOC)
                </h3>
                <span className="text-xs font-semibold text-[#053F5C]">Gold standard diagnostic test</span>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0] text-xs">
              {iocItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 first:pt-1 last:pb-0 text-[#183B4E] leading-relaxed font-medium break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCC: Most Common Cause */}
        {mccItems && mccItems.length > 0 && (
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F7AD19] shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                  Most Common Cause (MCC)
                </h3>
                <span className="text-xs font-semibold text-[#053F5C]">Primary etiology & frequency</span>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0] text-xs">
              {mccItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 first:pt-1 last:pb-0 text-[#183B4E] leading-relaxed font-medium break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Numerical Cutoffs & Target Values */}
      {goldenAnchors?.numericalCutoffs && goldenAnchors.numericalCutoffs.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#429EBD] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Numerical Cutoffs & Criteria
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">High-yield diagnostic thresholds</span>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {goldenAnchors.numericalCutoffs.map((item, i) => (
              <div key={i} className="py-2.5 first:pt-1 last:pb-0 space-y-1">
                <div className="text-xs font-medium text-[#5C768D] leading-snug break-words">
                  {item.label}
                </div>
                <div className="font-mono text-xs font-bold text-[#053F5C] bg-[#F0F6F9] border border-[#C5E6F1] px-2.5 py-1 rounded-md w-fit max-w-full break-words">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Clinical Regimens & Protocols */}
      {goldenAnchors?.regimenPhases && goldenAnchors.regimenPhases.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#053F5C] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Clinical Regimens & Protocols
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">Standard phased medical management</span>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {goldenAnchors.regimenPhases.map((reg, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-2.5">
                {/* Regimen Title */}
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#053F5C] leading-snug">
                    {reg.category || `Regimen ${idx + 1}`}
                  </h4>

                  {/* Duration */}
                  {reg.totalDuration && (
                    <div className="p-2.5 rounded-xl bg-[#EBF8FB] border border-[#B8D5E3] text-xs text-[#053F5C] font-medium leading-relaxed flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#429EBD] mt-0.5 shrink-0" />
                      <div className="flex-1 break-words">
                        <span className="font-semibold text-[#053F5C]">Duration: </span>
                        <span>{reg.totalDuration}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sequential Phases */}
                <div className="space-y-2 text-xs">
                  {reg.intensivePhase && (
                    <div className="p-3 rounded-xl bg-[#FEF6E7] border border-[#FDEBC8] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F7AD19] shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A5506]">
                          Phase 1 · Intensive
                        </span>
                      </div>
                      <p className="text-[#183B4E] leading-relaxed font-medium break-words pl-3">
                        {reg.intensivePhase}
                      </p>
                    </div>
                  )}

                  {reg.continuationPhase && (
                    <div className="p-3 rounded-xl bg-[#EBF8FB] border border-[#B8D5E3] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#429EBD] shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#053F5C]">
                          Phase 2 · Continuation / Maintenance
                        </span>
                      </div>
                      <p className="text-[#183B4E] leading-relaxed font-medium break-words pl-3">
                        {reg.continuationPhase}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Differential Comparison (Twins Matrix - Clean Medical Journal Table) */}
      {twinsMatrix && twinsMatrix.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3.5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#429EBD] shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                  Differential Comparison
                </h3>
                <span className="text-xs font-semibold text-[#053F5C]">Twins matrix differentiators</span>
              </div>
            </div>

            {twinsMatrix.length > 1 && (
              <div className="flex gap-1 bg-[#E2ECF2] p-0.5 rounded-lg">
                {twinsMatrix.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTwinIndex(i)}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer',
                      activeTwinIndex === i
                        ? 'bg-white text-[#053F5C] shadow-xs font-bold'
                        : 'text-[#5C768D] hover:text-[#053F5C]'
                    )}
                  >
                    Pair {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(() => {
            const currentTwin = twinsMatrix[activeTwinIndex] || twinsMatrix[0]
            if (!currentTwin) return null

            return (
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#053F5C]">
                  {currentTwin.title}
                </div>

                {/* Clean 2-Column Header Bar: Left vs Right */}
                <div className="grid grid-cols-2 gap-3 py-2.5 px-3 rounded-xl bg-[#F0F6F9] border border-[#E1ECF2] text-xs font-bold">
                  <div className="text-[#053F5C] pr-1 leading-snug break-words">
                    {currentTwin.leftEntity}
                  </div>
                  <div className="text-[#053F5C] pl-3 border-l border-[#C5E6F1] leading-snug break-words">
                    {currentTwin.rightEntity}
                  </div>
                </div>

                {/* Clean Comparison Rows */}
                <div className="divide-y divide-[#E2E8F0]">
                  {currentTwin.rows?.map((row, rIdx) => (
                    <div key={rIdx} className="py-3 first:pt-1 last:pb-0 space-y-1.5">
                      {/* Parameter Name */}
                      <span className="text-[11px] font-bold text-[#429EBD] block">
                        {row.parameter}
                      </span>

                      {/* 2-Column Comparative Content */}
                      <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                        <div className="text-[#183B4E] font-medium pr-1 break-words">
                          {row.leftValue}
                        </div>
                        <div className="text-[#183B4E] font-medium pl-3 border-l border-[#E2E8F0] break-words">
                          {row.rightValue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* 5. Pathognomonic Signs & Hallmarks */}
      {goldenAnchors?.pathognomonic && goldenAnchors.pathognomonic.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#053F5C] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Pathognomonic Findings
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">Exam hallmarks & specific signs</span>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0] text-xs">
            {goldenAnchors.pathognomonic.map((item, i) => (
              <div
                key={i}
                className="py-2.5 first:pt-1 last:pb-0 text-[#183B4E] font-medium leading-relaxed break-words flex items-start gap-2"
              >
                <span className="text-[#429EBD] font-bold mt-0.5 shrink-0">•</span>
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Key Triads & Buzzwords */}
      {goldenAnchors?.triadOrBuzzwords && goldenAnchors.triadOrBuzzwords.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#429EBD] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Diagnostic Triads & Buzzwords
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">Core clinical associations</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {goldenAnchors.triadOrBuzzwords.map((buzz, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#EDF9FC] text-[#053F5C] border border-[#9FE7F5] font-semibold break-words"
              >
                {buzz}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Clinical Pitfalls & Exam Traps */}
      {trapsAndMnemonics?.examTraps && trapsAndMnemonics.examTraps.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7AD19] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Clinical Pitfalls & Exam Traps
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">Common exam confusion points</span>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {trapsAndMnemonics.examTraps.map((trap, idx) => {
              if (typeof trap === 'string') {
                return (
                  <div
                    key={idx}
                    className="py-2.5 first:pt-1 last:pb-0 text-xs text-[#183B4E] font-medium leading-relaxed break-words"
                  >
                    {trap}
                  </div>
                )
              }

              return (
                <div key={idx} className="py-3 first:pt-1 last:pb-0 space-y-1.5 text-xs">
                  <div className="font-bold text-[#053F5C] leading-snug break-words">
                    Don't confuse: <span className="font-semibold text-[#183B4E]">{trap.dontConfuse}</span>
                  </div>
                  {trap.withWhat && (
                    <div className="text-xs text-[#5C768D] font-medium break-words">
                      <span className="text-[#889DA8] font-normal">vs: </span>
                      {trap.withWhat}
                    </div>
                  )}
                  {trap.differentiator && (
                    <div className="p-2.5 rounded-xl bg-[#FEF6E7] border border-[#FDEBC8] text-[#8A5506] font-medium text-xs leading-relaxed break-words">
                      <span className="font-bold text-[#DC930B]">Differentiator: </span>
                      {trap.differentiator}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 8. Mnemonics */}
      {trapsAndMnemonics?.mnemonics && trapsAndMnemonics.mnemonics.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#429EBD] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                Mnemonics & Memory Hooks
              </h3>
              <span className="text-xs font-semibold text-[#053F5C]">Fast recall shortcuts</span>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {trapsAndMnemonics.mnemonics.map((mne, idx) => (
              <div key={idx} className="py-3 first:pt-1 last:pb-0 text-xs space-y-1.5">
                <div className="font-bold text-[#053F5C]">{mne.title}</div>
                <div className="font-mono text-xs font-bold text-[#053F5C] bg-[#F0F6F9] px-2.5 py-1.5 rounded-lg border border-[#E1ECF2] w-fit max-w-full break-words">
                  {mne.expansion}
                </div>
                {mne.note && (
                  <p className="text-[11px] text-[#5C768D] leading-relaxed pt-0.5 break-words">
                    {mne.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
