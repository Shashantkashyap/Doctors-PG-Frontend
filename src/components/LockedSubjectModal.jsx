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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xs p-6 bg-obsidian-900 border border-obsidian-700 rounded-3xl shadow-float overflow-hidden animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-obsidian-400 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-cliniq-pharm mb-3">
            <Lock className="w-5 h-5 stroke-[1.8]" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            {subjectName || 'Subject'}
          </h3>

          <p className="text-xs text-obsidian-400 leading-relaxed mb-5">
            This subject is currently in specialist editorial review and will be unlocked in the upcoming update.
          </p>

          <button
            onClick={handleNotify}
            disabled={notified}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
              notified
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 shadow-xs'
            }`}
          >
            {notified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
