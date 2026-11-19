import React, { useState } from 'react'
import { Lock, Bell, CheckCircle2, X } from 'lucide-react'

export const LOCKED_SUBJECTS = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Microbiology',
  'Forensic Medicine',
  'ENT',
  'Ophthalmology',
  'Medicine',
  'Surgery',
  'OBG',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Psychiatry',
  'Radiology',
  'Anesthesia',
]

export default function LockedSubjectModal({ subjectName, isOpen, onClose }) {
  const [notified, setNotified] = useState(false)

  if (!isOpen) return null

  const handleNotify = () => {
    setNotified(true)
    setTimeout(() => {
      onClose()
      setNotified(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161B18]/30 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xs p-6 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl shadow-float overflow-hidden animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#7D8880] hover:text-[#161B18] rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DB] flex items-center justify-center text-[#4F5D3A] mb-3">
            <Lock className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h3 className="text-base font-serif font-bold text-[#161B18] mb-1">
            {subjectName || 'Subject'}
          </h3>

          <p className="text-xs text-[#5C6860] leading-relaxed mb-5">
            This module is currently in clinical editorial review and will be available in the upcoming update.
          </p>

          <button
            onClick={handleNotify}
            disabled={notified}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
              notified
                ? 'bg-[#EDF5F0] text-[#1A472A] border border-[#C6E2D0]'
                : 'bg-[#1A3626] hover:bg-[#132B1E] text-[#FAF8F5] border border-[#234532] shadow-xs'
            }`}
          >
            {notified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5740]" />
                <span>Preference Saved</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Notify When Available</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
