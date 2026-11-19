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
            className="w-7 h-7 rounded-full bg-[#EAE5DB] hover:bg-[#DDD6C8] text-[#5C6860] hover:text-[#161B18] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Centered Doctor Profile Hero */}
        <div className="pt-4 pb-5 px-6 text-center space-y-1">
          <div className="w-16 h-16 rounded-full bg-[#1A3626] text-[#FAF8F5] font-sans font-bold text-xl flex items-center justify-center shadow-md shadow-[#1A3626]/20 mx-auto select-none border border-[#234532]">
            {initials}
          </div>

          <div className="pt-2">
            <h3 className="text-[17px] font-bold font-sans text-[#161B18] tracking-tight">
              {user.name}
            </h3>
            <p className="text-[13px] text-[#5C6860] font-sans">
              {user.email}
            </p>
          </div>
        </div>

        {/* Success toast if target exam changes */}
        {successNote && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-[#EDF5F0] border border-[#B8DCB3] text-[#1A472A] text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-[#2E7D47] shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Apple Inset Grouped Section */}
        <div className="px-4 space-y-3">
          {/* Target Exam Group */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5E0D5] shadow-xs p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-medium text-[#5C6860] font-sans">
                Target Examination
              </span>
              <span className="text-[11px] font-semibold text-[#2E5740] font-sans">
                {user.targetExam?.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-[#EAE5DB] rounded-xl">
              {EXAMS.map((exam) => {
                const isSelected = user.targetExam === exam.id
                return (
                  <button
                    key={exam.id}
                    onClick={() => handleExamChange(exam.id)}
                    disabled={isUpdating}
                    className={cn(
                      'py-1.5 px-2 text-[12px] font-semibold font-sans rounded-lg transition-all cursor-pointer active:scale-95',
                      isSelected
                        ? 'bg-[#1A3626] text-[#FAF8F5] shadow-xs'
                        : 'text-[#5C6860] hover:text-[#161B18] hover:bg-[#DDD6C8]/60'
                    )}
                  >
                    {exam.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sync Status Group */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5E0D5] shadow-xs px-4 py-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#434D46] font-sans">
              Clinical Progress
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2E7D47] font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D47] animate-pulse" />
              Synced to Cloud
            </span>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#FAF0EE] text-[#9C3D32] hover:text-[#78261C] font-medium text-[14px] font-sans border border-[#E5E0D5] hover:border-[#EED7D2] transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
