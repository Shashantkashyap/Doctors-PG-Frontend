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
      console.error('Note update failed:', err)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleUnpin = async (topicId) => {
    try {
      await apiService.toggleNotebook(topicId)
      setBookmarks((prev) => prev.filter((b) => b.topicId !== topicId))
      if (onUpdateCounts) onUpdateCounts(Math.max(0, bookmarks.length - 1))
    } catch (err) {
      console.error('Unpin failed:', err)
    }
  }

  const filters = [
    { id: 'ALL', label: 'All' },
    { id: 'PHARM', label: 'Pharmacology' },
    { id: 'PATH', label: 'Pathology' },
    { id: 'PSM', label: 'PSM' },
  ]

  return (
    <div className="space-y-4 pb-16 animate-fade-in pt-3">
      {/* Header */}
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between px-0.5">
          <div>
            <h1 className="text-[18px] font-bold font-outfit text-slate-900 tracking-tight">
              20th Notebook
            </h1>
            <p className="text-[12px] text-slate-500 font-normal">
              High-yield saved cards for 48h pre-exam cramming
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">
            {bookmarks.length} saved
          </span>
        </div>

        {/* Apple Segmented Filter Bar */}
        <div className="inline-flex p-1 bg-slate-200/60 rounded-xl gap-1 w-full overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                'flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all whitespace-nowrap active:scale-[0.98]',
                selectedFilter === f.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
          <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-normal">Loading notebook...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-16 text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-100">
            <Bookmark className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Notebook is empty
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-inter">
            Tap the bookmark icon on any revision card to save it here with personal notes.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover space-y-3 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                      {bm.subject?.code || 'TOPIC'}
                    </span>
                    {bm.subtopic && (
                      <span className="text-slate-400 truncate">
                        {bm.subtopic}
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onSelectTopic(bm.slug)}
                    className="text-[14px] font-semibold font-outfit text-slate-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-1 leading-snug"
                  >
                    {bm.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUnpin(bm.topicId)}
                    title="Remove from notebook"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectTopic(bm.slug)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Anchors */}
              {bm.goldenAnchorsSummary && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  {bm.goldenAnchorsSummary.doc && (
                    <div className="text-slate-700 font-medium line-clamp-2">
                      <span className="font-semibold text-slate-900 mr-1">DOC:</span>
                      {bm.goldenAnchorsSummary.doc}
                    </div>
                  )}
                  {bm.goldenAnchorsSummary.ioc && (
                    <div className="text-slate-700 font-medium line-clamp-1">
                      <span className="font-semibold text-slate-900 mr-1">IOC:</span>
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
                      placeholder="Add personal clinical note..."
                      rows={2}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(bm.topicId)}
                        disabled={isSavingNote}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleStartEditNote(bm)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between text-xs text-slate-500 group transition-colors"
                  >
                    <span className="line-clamp-1 font-normal">
                      {bm.personalNote || 'Tap to add personal clinical note...'}
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
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
