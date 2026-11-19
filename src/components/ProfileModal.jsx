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
        className="fixed inset-0 bg-[#053F5C]/30 backdrop-blur-xs transition-opacity"
      />

      {/* Apple-Style Bottom Sheet Surface */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] sm:rounded-3xl border border-[#CBD5E1]/80 shadow-[0_20px_60px_-15px_rgba(5,63,92,0.22)] overflow-hidden z-10 animate-slide-up pb-8 sm:pb-6">
        {/* iOS Drag Handle */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-9 h-1 rounded-full bg-[#CBD5E1]" />
        </div>

        {/* Close Button in top right */}
        <div className="absolute top-3.5 right-3.5">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F0F6F9] hover:bg-[#E2F3F8] text-[#5C768D] hover:text-[#053F5C] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Centered Doctor Profile Hero */}
        <div className="pt-4 pb-5 px-6 text-center space-y-1">
          <div className="w-16 h-16 rounded-full bg-[#053F5C] text-white font-sans font-bold text-xl flex items-center justify-center shadow-md shadow-[#053F5C]/25 mx-auto select-none border border-[#084869]">
            {initials}
          </div>

          <div className="pt-2">
            <h3 className="text-[17px] font-bold font-sans text-[#053F5C] tracking-tight">
              {user.name}
            </h3>
            <p className="text-[13px] text-[#5C768D] font-sans">
              {user.email}
            </p>
          </div>
        </div>

        {/* Success toast if target exam changes */}
        {successNote && (
          <div className="mx-4 mb-3 p-2.5 rounded-xl bg-[#EDF9FC] border border-[#9FE7F5] text-[#053F5C] text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-[#429EBD] shrink-0" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Apple Inset Grouped Section */}
        <div className="px-4 space-y-3">
          {/* Target Exam Group */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[12px] font-medium text-[#5C768D] font-sans">
                Target Examination
              </span>
              <span className="text-[11px] font-semibold text-[#429EBD] font-sans">
                {user.targetExam?.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2ECF2] rounded-xl">
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
                        ? 'bg-[#053F5C] text-white shadow-xs'
                        : 'text-[#5C768D] hover:text-[#053F5C] hover:bg-white/60'
                    )}
                  >
                    {exam.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sync Status Group */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] shadow-xs px-4 py-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#053F5C] font-sans">
              Clinical Progress
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#429EBD] font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#429EBD] animate-pulse" />
              Synced to Cloud
            </span>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] font-medium text-[14px] font-sans border border-[#FECACA] transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
