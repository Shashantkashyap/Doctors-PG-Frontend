import React, { useState } from 'react'
import { X, LogOut, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

const EXAMS = [
  { id: 'NEET_PG', label: 'NEET PG' },
  { id: 'INI_CET', label: 'INI-CET' },
  { id: 'FMGE', label: 'FMGE' },
]

export default function ProfileModal({ isOpen, onClose }) {
  const { user, logout, updateTargetExam } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [successNote, setSuccessNote] = useState('')

  if (!isOpen || !user) return null

  // User initials for avatar
  const initials = user.name
    ? user.name
        .replace(/^(Dr\.|Dr)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DR'

  const handleExamChange = async (examId) => {
    if (examId === user.targetExam || isUpdating) return
    setIsUpdating(true)
    const res = await updateTargetExam(examId)
    setIsUpdating(false)
    if (res?.success) {
      setSuccessNote(`Target updated to ${examId.replace('_', ' ')}`)
      setTimeout(() => setSuccessNote(''), 2000)
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity"
      />

      {/* Apple-Style Bottom Sheet Surface */}
      <div className="relative w-full max-w-[390px] bg-[#F2F4F8] rounded-t-[28px] sm:rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] overflow-hidden z-10 animate-slide-up pb-8 sm:pb-6">
        {/* iOS Drag Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-9 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Close Button in top right */}
        <div className="absolute top-3.5 right-3.5">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Centered Doctor Profile Hero */}
        <div className="pt-4 pb-5 px-6 text-center space-y-1">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white font-outfit font-bold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20 mx-auto select-none">
            {initials}
          </div>

          <div className="pt-2">
            <h3 className="text-[17px] font-bold font-outfit text-slate-900 tracking-tight">
              {user.name}
            </h3>
            <p className="text-[13px] text-slate-500 font-inter">
              {user.email}
            </p>
          </div>
        </div>

        {/* Success toast if target exam changes */}
        {successNote && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Apple Inset Grouped Section */}
        <div className="px-4 space-y-3">
          {/* Target Exam Group */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-medium text-slate-500 font-inter">
                Target Examination
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 font-inter">
                {user.targetExam?.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
              {EXAMS.map((exam) => {
                const isSelected = user.targetExam === exam.id
                return (
                  <button
                    key={exam.id}
                    onClick={() => handleExamChange(exam.id)}
                    disabled={isUpdating}
                    className={cn(
                      'py-1.5 px-2 text-[12px] font-semibold font-outfit rounded-lg transition-all cursor-pointer active:scale-95',
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    )}
                  >
                    {exam.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sync Status Group */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-600 font-inter">
              Clinical Progress
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced to Cloud
            </span>
          </div>

          {/* Apple Destructive Action: Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-rose-50/60 text-rose-600 hover:text-rose-700 font-medium text-[14px] font-inter border border-slate-200/80 hover:border-rose-200 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
