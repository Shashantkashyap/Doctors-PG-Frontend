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
            <h1 className="text-[19px] font-bold text-[#053F5C] tracking-tight">
              20th Notebook
            </h1>
            <p className="text-[12px] text-[#5C768D] font-normal">
              High-yield saved cards for 48h pre-exam cramming
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-[#889DA8]">
            {bookmarks.length} saved
          </span>
        </div>

        {/* Refined Segmented Filter Bar */}
        <div className="inline-flex p-1 bg-[#E2ECF2] rounded-xl gap-1 w-full overflow-x-auto no-scrollbar border border-[#C5E6F1]">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={cn(
                'flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all whitespace-nowrap active:scale-[0.98] cursor-pointer',
                selectedFilter === f.id
                  ? 'bg-white text-[#053F5C] font-bold shadow-xs'
                  : 'text-[#5C768D] hover:text-[#053F5C]'
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
          <div className="w-5 h-5 border-2 border-[#C5E6F1] border-t-[#053F5C] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#5C768D] font-normal">Loading notebook...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="py-16 text-center p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FEF6E7] text-[#F7AD19] flex items-center justify-center mx-auto mb-2 border border-[#FDEBC8]">
            <Bookmark className="w-5 h-5 stroke-[1.8] fill-[#F7AD19]" />
          </div>
          <h3 className="text-sm font-bold text-[#053F5C]">
            Notebook is empty
          </h3>
          <p className="text-xs text-[#5C768D] max-w-xs mx-auto leading-relaxed">
            Tap the bookmark icon on any revision card to save it here with personal notes.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#9FE7F5] space-y-3 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                    <span className="font-semibold text-[#053F5C] bg-[#E2F3F8] border border-[#C5E6F1] px-1.5 py-0.5 rounded font-mono text-[10px]">
                      {bm.subject?.code || 'TOPIC'}
                    </span>
                    {bm.subtopic && (
                      <span className="text-[#889DA8] truncate">
                        {bm.subtopic}
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onSelectTopic(bm.slug)}
                    className="text-[14px] font-semibold text-[#053F5C] hover:text-[#429EBD] cursor-pointer transition-colors line-clamp-1 leading-snug"
                  >
                    {bm.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUnpin(bm.topicId)}
                    title="Remove from notebook"
                    className="p-1.5 rounded-lg text-[#889DA8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectTopic(bm.slug)}
                    className="p-1.5 rounded-lg text-[#889DA8] hover:text-[#053F5C] hover:bg-[#F0F6F9] transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Anchors */}
              {bm.goldenAnchorsSummary && (
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1">
                  {bm.goldenAnchorsSummary.doc && (
                    <div className="text-[#183B4E] font-medium line-clamp-2">
                      <span className="font-bold text-[#053F5C] mr-1">DOC:</span>
                      {bm.goldenAnchorsSummary.doc}
                    </div>
                  )}
                  {bm.goldenAnchorsSummary.ioc && (
                    <div className="text-[#183B4E] font-medium line-clamp-1">
                      <span className="font-bold text-[#429EBD] mr-1">IOC:</span>
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
                      className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#053F5C] placeholder:text-[#889DA8] focus:outline-none focus:border-[#429EBD] focus:bg-white resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-xs text-[#5C768D] hover:text-[#053F5C] font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(bm.topicId)}
                        disabled={isSavingNote}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#053F5C] hover:bg-[#032B40] text-white border border-[#084869] flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-[#9FE7F5]" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleStartEditNote(bm)}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F6F9] border border-[#E2E8F0] cursor-pointer flex items-center justify-between text-xs text-[#5C768D] group transition-colors"
                  >
                    <span className="line-clamp-1 font-normal">
                      {bm.personalNote || 'Tap to add personal clinical note...'}
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-[#889DA8] group-hover:text-[#053F5C] shrink-0 ml-2" />
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
