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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xs p-6 bg-white border border-slate-200/90 rounded-2xl shadow-float overflow-hidden animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
            <Lock className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">
            {subjectName || 'Subject'}
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed mb-5">
            This module is currently in clinical editorial review and will be available in the upcoming update.
          </p>

          <button
            onClick={handleNotify}
            disabled={notified}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 ${
              notified
                ? 'bg-slate-100 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {notified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
