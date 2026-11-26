import React, { useState } from 'react'
import {
  Clock,
  GitCompare,
  AlertTriangle,
  ArrowRight,
  Share2,
  BookOpen,
} from 'lucide-react'
import { cn } from '../utils/cn'

export default function WardCard({ topic }) {
  if (!topic) return null

  const {
    goldenAnchors = {},
    twinsMatrix = [],
    trapsAndMnemonics = {},
    connectedTopics = [],
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
    <div className="space-y-3.5 pb-4 animate-fade-in">
      {/* 1. THREE GOLDEN ANCHORS (DOC, IOC, MCC) */}
      <div className="space-y-2.5">
        {/* DOC: Drug / Treatment of Choice */}
        {docItems && docItems.length > 0 && (
          <div className="rounded-2xl bg-[#121622] border border-blue-500/25 p-3.5 sm:p-4 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Drug / Treatment of Choice (DOC)
                </h3>
                <span className="text-[11px] text-zinc-400">First-line gold standard medical therapy</span>
              </div>
            </div>
            <div className="divide-y divide-[#20283C] text-xs">
              {docItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2 first:pt-1 last:pb-0 text-white leading-relaxed font-semibold break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IOC: Investigation of Choice */}
        {iocItems && iocItems.length > 0 && (
          <div className="rounded-2xl bg-[#121622] border border-indigo-500/25 p-3.5 sm:p-4 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Investigation of Choice (IOC)
                </h3>
                <span className="text-[11px] text-zinc-400">Diagnostic gold standard confirmation</span>
              </div>
            </div>
            <div className="divide-y divide-[#20283C] text-xs">
              {iocItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2 first:pt-1 last:pb-0 text-white leading-relaxed font-semibold break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCC: Most Common Cause */}
        {mccItems && mccItems.length > 0 && (
          <div className="rounded-2xl bg-[#121622] border border-amber-500/25 p-3.5 sm:p-4 shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Most Common Cause (MCC)
                </h3>
                <span className="text-[11px] text-zinc-400">Primary etiology & signature exam recall</span>
              </div>
            </div>
            <div className="divide-y divide-[#20283C] text-xs">
              {mccItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2 first:pt-1 last:pb-0 text-white leading-relaxed font-semibold break-words"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Numerical Cutoffs Matrix (with Textbook Page Citations) */}
      {goldenAnchors?.numericalCutoffs && goldenAnchors.numericalCutoffs.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-trap shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Numerical Cutoffs & Thresholds
              </h3>
              <span className="text-[11px] text-obsidian-400">Diagnostic ranges & exact textbook citations</span>
            </div>
          </div>

          <div className="divide-y divide-obsidian-700/60">
            {goldenAnchors.numericalCutoffs.map((item, i) => (
              <div key={i} className="py-2.5 first:pt-1 last:pb-0 space-y-1.5">
                <div className="text-xs font-medium text-obsidian-300 leading-snug break-words">
                  {item.parameter || item.label}
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="font-mono text-xs font-bold text-amber-300 bg-obsidian-850 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                    {item.value}
                  </div>
                  {(item.bookPage || item.citation) && (
                    <span className="text-[10px] font-mono text-obsidian-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-obsidian-500" />
                      {item.bookPage || item.citation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Clinical Regimens & Protocols */}
      {goldenAnchors?.regimenPhases && goldenAnchors.regimenPhases.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-pharm shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Clinical Regimens & Dosing Phases
              </h3>
              <span className="text-[11px] text-obsidian-400">Standard phased medical management</span>
            </div>
          </div>

          <div className="divide-y divide-obsidian-700/60">
            {goldenAnchors.regimenPhases.map((reg, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-2">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {reg.category || `Regimen ${idx + 1}`}
                  </h4>
                  {reg.totalDuration && (
                    <div className="p-2 rounded-xl bg-obsidian-850 border border-obsidian-700 text-xs text-obsidian-300 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cliniq-pharm shrink-0" />
                      <span className="font-semibold text-white">Duration: </span>
                      <span>{reg.totalDuration}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  {reg.intensivePhase && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cliniq-trap shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Phase 1 · Intensive
                        </span>
                      </div>
                      <p className="text-obsidian-200 leading-relaxed font-medium break-words pl-3">
                        {reg.intensivePhase}
                      </p>
                    </div>
                  )}

                  {reg.continuationPhase && (
                    <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cliniq-pharm shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                          Phase 2 · Continuation / Maintenance
                        </span>
                      </div>
                      <p className="text-obsidian-200 leading-relaxed font-medium break-words pl-3">
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

      {/* 4. Twins Matrix ("Don't Confuse X with Y") */}
      {twinsMatrix && twinsMatrix.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-3.5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cliniq-patho shrink-0" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Twins Matrix ("Don't Confuse X with Y")
                </h3>
                <span className="text-[11px] text-obsidian-400">Side-by-side exam differentiators</span>
              </div>
            </div>

            {twinsMatrix.length > 1 && (
              <div className="flex gap-1 bg-obsidian-850 p-0.5 rounded-lg border border-obsidian-700">
                {twinsMatrix.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTwinIndex(i)}
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer',
                      activeTwinIndex === i
                        ? 'bg-obsidian-700 text-white font-bold border border-obsidian-600'
                        : 'text-obsidian-400 hover:text-white'
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
                {currentTwin.title && (
                  <div className="text-xs font-bold text-white">
                    {currentTwin.title}
                  </div>
                )}

                {/* 2-Column Header Bar: Left vs Right */}
                <div className="grid grid-cols-2 gap-3 py-2.5 px-3 rounded-xl bg-obsidian-850 border border-obsidian-700 text-xs font-bold">
                  <div className="text-sky-400 pr-1 leading-snug break-words">
                    {currentTwin.conceptA || currentTwin.leftEntity || 'Concept A'}
                  </div>
                  <div className="text-indigo-400 pl-3 border-l border-obsidian-700 leading-snug break-words">
                    {currentTwin.conceptB || currentTwin.rightEntity || 'Concept B'}
                  </div>
                </div>

                {/* Single Discriminator if present */}
                {currentTwin.discriminator && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-400">⚡ Discriminator: </span>
                    <span>{currentTwin.discriminator}</span>
                  </div>
                )}

                {/* Comparison Rows */}
                {currentTwin.rows && (
                  <div className="divide-y divide-obsidian-700/60">
                    {currentTwin.rows.map((row, rIdx) => (
                      <div key={rIdx} className="py-2.5 first:pt-1 last:pb-0 space-y-1.5">
                        <span className="text-[11px] font-bold text-cliniq-pharm block">
                          {row.parameter}
                        </span>
                        <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                          <div className="text-obsidian-200 font-medium pr-1 break-words">
                            {row.leftValue}
                          </div>
                          <div className="text-obsidian-200 font-medium pl-3 border-l border-obsidian-700 break-words">
                            {row.rightValue}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* 5. Pathognomonic Signs & Buzzwords */}
      {goldenAnchors?.pathognomonic && goldenAnchors.pathognomonic.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-psm shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Pathognomonic Findings & Buzzwords
              </h3>
              <span className="text-[11px] text-obsidian-400">Signature histopath & clinical signs</span>
            </div>
          </div>

          <div className="divide-y divide-obsidian-700/60 text-xs">
            {goldenAnchors.pathognomonic.map((item, i) => (
              <div
                key={i}
                className="py-2 first:pt-1 last:pb-0 text-obsidian-200 font-medium leading-relaxed break-words flex items-start gap-2"
              >
                <span className="text-cliniq-psm font-bold mt-0.5 shrink-0">•</span>
                <span className="flex-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Diagnostic Triads */}
      {goldenAnchors?.triadOrBuzzwords && goldenAnchors.triadOrBuzzwords.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-pharm shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Diagnostic Triads & Clinical Associations
              </h3>
              <span className="text-[11px] text-obsidian-400">Classic triads tested in NEET PG</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {goldenAnchors.triadOrBuzzwords.map((buzz, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/25 font-semibold break-words"
              >
                {buzz}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Clinical Pitfalls & Examiner Traps */}
      {trapsAndMnemonics && (
        <div className="rounded-2xl bg-obsidian-800 border border-amber-500/30 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-trap shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Clinical Traps & Mnemonics
              </h3>
              <span className="text-[11px] text-obsidian-400">High-yield recall shortcuts & examiner traps</span>
            </div>
          </div>

          {/* Mnemonics */}
          {Array.isArray(trapsAndMnemonics) ? (
            <div className="divide-y divide-obsidian-700/60">
              {trapsAndMnemonics.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5 text-xs">
                  {item.mnemonic && (
                    <div className="font-mono text-xs font-bold text-amber-300 bg-obsidian-850 px-2.5 py-1 rounded-lg border border-amber-500/25 w-fit">
                      {item.mnemonic}
                    </div>
                  )}
                  {item.expansion && (
                    <p className="text-white font-medium pl-1">{item.expansion}</p>
                  )}
                  {item.examTrap && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs leading-relaxed">
                      <span className="font-bold text-amber-400">⚠️ Examiner Trap: </span>
                      <span>{item.examTrap}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {trapsAndMnemonics.examTraps && trapsAndMnemonics.examTraps.map((trap, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 leading-relaxed">
                  <span className="font-bold text-amber-400">⚠️ Trap: </span>
                  <span>{typeof trap === 'string' ? trap : trap.differentiator || trap.dontConfuse}</span>
                </div>
              ))}

              {trapsAndMnemonics.mnemonics && trapsAndMnemonics.mnemonics.map((mne, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-obsidian-850 border border-obsidian-700 text-xs space-y-1">
                  <div className="font-bold text-white">{mne.title}</div>
                  <div className="font-mono text-xs font-bold text-cliniq-pharm bg-obsidian-800 px-2 py-1 rounded border border-obsidian-700 w-fit">
                    {mne.expansion}
                  </div>
                  {mne.note && <p className="text-[11px] text-obsidian-400">{mne.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. Visual Connection Points (Cross-Subject Synapse Hub) */}
      {connectedTopics && connectedTopics.length > 0 && (
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-700 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cliniq-pharm shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Cross-Subject Synapse Hub
              </h3>
              <span className="text-[11px] text-obsidian-400">Integrated clinical connections across MBBS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {connectedTopics.map((conn, idx) => {
              const isObj = typeof conn === 'object' && conn !== null
              const title = isObj ? conn.title || conn.topicSlug : conn
              const subject = isObj ? conn.subjectCode : null
              const hook = isObj ? conn.examHook || conn.connectionType : null

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-obsidian-850 border border-obsidian-700 hover:border-cliniq-pharm/40 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{title}</span>
                    {subject && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian-800 border border-obsidian-700 text-cliniq-pharm">
                        {subject}
                      </span>
                    )}
                  </div>
                  {hook && (
                    <p className="text-[11px] text-obsidian-300 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-cliniq-pharm shrink-0" />
                      <span>{hook}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
