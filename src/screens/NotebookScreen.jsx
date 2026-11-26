import React, { useState, useEffect } from 'react'
import {
  Bookmark,
  Edit3,
  Check,
  Trash2,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { apiService } from '../api/client'
import { cn } from '../utils/cn'

export default function NotebookScreen({ onSelectTopic, onUpdateCounts }) {
  const [bookmarks, setBookmarks] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(true)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [isSavingNote, setIsSavingNote] = useState(false)

  const fetchNotebook = () => {
    setIsLoading(true)
    const param = selectedFilter === 'ALL' ? undefined : selectedFilter
    apiService
      .getNotebook(param)
      .then((data) => {
        if (data?.bookmarks) {
          setBookmarks(data.bookmarks)
          if (onUpdateCounts) onUpdateCounts(data.bookmarks.length)
        }
      })
      .catch((err) => console.error('Notebook error:', err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchNotebook()
  }, [selectedFilter])

  const handleStartEditNote = (bookmark) => {
    setEditingNoteId(bookmark.topicId)
    setNoteText(bookmark.personalNote || '')
  }

  const handleSaveNote = async (topicId) => {
    setIsSavingNote(true)
    try {
      await apiService.updateNotebookNote(topicId, noteText)
      setBookmarks((prev) =>
        prev.map((b) => (b.topicId === topicId ? { ...b, personalNote: noteText } : b))
      )
      setEditingNoteId(null)
    } catch (err) {
      console.error('Save note error:', err)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleUnpin = async (topicId) => {
    try {
      await apiService.toggleNotebook(topicId)
      setBookmarks((prev) => prev.filter((b) => b.topicId !== topicId))
      if (onUpdateCounts) onUpdateCounts(bookmarks.length - 1)
    } catch (err) {
      console.error('Unpin error:', err)
    }
  }

  const filters = [
    { id: 'ALL', label: 'All Saved' },
    { id: 'PHARM', label: 'Pharmacology' },
    { id: 'PATH', label: 'Pathology' },
    { id: 'PSM', label: 'PSM' },
  ]

  return (
    <div className="space-y-4 pb-24 animate-fade-in pt-1">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              20th Notebook (Saved Revision Cards)
            </h1>
            <p className="text-xs text-obsidian-400">
              High-yield pearls, cutoffs, and personal notes for active recall.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 font-bold">
            {bookmarks.length} Saved
          </span>
        </div>

        {/* Filter Bar */}
        <div className="p-1 bg-obsidian-800 rounded-xl border border-obsidian-700 flex gap-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                'flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap active:scale-[0.98] cursor-pointer',
                selectedFilter === f.id
                  ? 'bg-obsidian-700 text-white font-bold border border-obsidian-600 shadow-xs'
                  : 'text-obsidian-400 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center space-y-2">
          <div className="w-5 h-5 border-2 border-obsidian-600 border-t-cliniq-pharm rounded-full animate-spin mx-auto" />
          <p className="text-xs text-obsidian-400 font-normal">Loading notebook...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-16 text-center p-6 bg-obsidian-800 rounded-2xl border border-obsidian-700 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-500/25">
            <Bookmark className="w-5 h-5 stroke-[1.8] fill-amber-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            Notebook is empty
          </h3>
          <p className="text-xs text-obsidian-400 max-w-xs mx-auto leading-relaxed">
            Tap the bookmark icon on any clinical card to save it here with personal high-yield notes.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-4 rounded-2xl bg-obsidian-800 border border-obsidian-700 shadow-xs hover:border-cliniq-pharm/50 space-y-3 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                    <span className="font-semibold text-cliniq-pharm bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {bm.subject?.code || 'TOPIC'}
                    </span>
                    {bm.subtopic && (
                      <span className="text-obsidian-400 truncate">
                        {bm.subtopic}
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onSelectTopic(bm.slug)}
                    className="text-[14px] font-bold text-white hover:text-cliniq-pharm cursor-pointer transition-colors line-clamp-1 leading-snug"
                  >
                    {bm.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUnpin(bm.topicId)}
                    title="Remove from notebook"
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectTopic(bm.slug)}
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-750 transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Anchors */}
              {bm.goldenAnchorsSummary && (
                <div className="p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-700 text-xs space-y-1">
                  {bm.goldenAnchorsSummary.doc && (
                    <div className="text-obsidian-200 font-medium line-clamp-2">
                      <span className="font-bold text-cliniq-pharm mr-1">DOC:</span>
                      {bm.goldenAnchorsSummary.doc}
                    </div>
                  )}
                  {bm.goldenAnchorsSummary.ioc && (
                    <div className="text-obsidian-200 font-medium line-clamp-1">
                      <span className="font-bold text-cliniq-patho mr-1">IOC:</span>
                      {bm.goldenAnchorsSummary.ioc}
                    </div>
                  )}
                </div>
              )}

              {/* Personal Notes */}
              <div>
                {editingNoteId === bm.topicId ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add personal mnemonics, cutoffs, or clinical pearls..."
                      className="w-full p-2.5 rounded-xl border border-obsidian-700 bg-obsidian-850 text-white text-xs placeholder-obsidian-500 focus:outline-none focus:border-cliniq-pharm focus:ring-1 focus:ring-cliniq-pharm/20 resize-none min-h-[64px]"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-obsidian-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(bm.topicId)}
                        disabled={isSavingNote}
                        className="px-3 py-1 bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleStartEditNote(bm)}
                    className="p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-700 hover:border-obsidian-600 transition-colors flex items-start justify-between gap-2 group cursor-pointer"
                  >
                    <p className="text-xs text-obsidian-300 italic flex-1 break-words">
                      {bm.personalNote || 'Tap to add personal clinical notes...'}
                    </p>
                    <Edit3 className="w-3.5 h-3.5 text-obsidian-500 group-hover:text-cliniq-pharm transition-colors shrink-0 mt-0.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
