import React, { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { LogoIcon, LogoFull } from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

const EXAMS = [
  { id: 'NEET_PG', label: 'NEET PG' },
  { id: 'INI_CET', label: 'INI-CET' },
  { id: 'FMGE', label: 'FMGE' },
]

export default function LoginScreen({ onLoginSuccess }) {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [targetExam, setTargetExam] = useState('NEET_PG')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationDetails, setValidationDetails] = useState(null)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setErrorMessage('')
    setValidationDetails(null)

    if (!name.trim()) {
      setErrorMessage('Please enter your name')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login({ name, email, targetExam })
      setIsSubmitting(false)

      if (result.success) {
        if (onLoginSuccess) onLoginSuccess(result.user)
      } else {
        setErrorMessage(result.error || 'Unable to sign in. Please check your details.')
        if (result.details) setValidationDetails(result.details)
      }
    } catch (err) {
      setIsSubmitting(false)
      setErrorMessage(err?.message || 'Authentication error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-obsidian-950 text-white font-sans antialiased">
      <div className="w-full max-w-[380px]">
        {/* Obsidian Dark Card */}
        <div className="bg-obsidian-900 rounded-3xl border border-obsidian-700 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-6 sm:p-7 space-y-5">
          {/* Brand & Heading */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center">
              <LogoIcon className="w-12 h-12" />
            </div>

            <div className="flex items-center justify-center gap-1">
              <span className="text-xl font-extrabold text-white tracking-tight">Clin</span>
              <span className="text-xl font-extrabold text-cliniq-pharm tracking-tight">IQ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cliniq-trap ml-0.5 mt-2" />
            </div>

            <h1 className="text-sm font-bold text-white tracking-tight">
              Pocket Clinical Revision & Instant Search
            </h1>
            <p className="text-xs text-obsidian-400">
              3-minute capsules and exam-calibrated MCQs for MBBS doctors.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="full-name"
                className="block text-xs font-semibold text-obsidian-300 mb-1.5"
              >
                Doctor / Student Name
              </label>
              <input
                id="full-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Aarav Sharma"
                autoComplete="name"
                required
                className="w-full h-10 px-3 bg-obsidian-800 border border-obsidian-700 rounded-xl text-xs sm:text-sm text-white placeholder-obsidian-500 transition-all focus:border-cliniq-pharm focus:ring-1 focus:ring-cliniq-pharm/20 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-semibold text-obsidian-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@hospital.edu"
                autoComplete="email"
                required
                className="w-full h-10 px-3 bg-obsidian-800 border border-obsidian-700 rounded-xl text-xs sm:text-sm text-white placeholder-obsidian-500 transition-all focus:border-cliniq-pharm focus:ring-1 focus:ring-cliniq-pharm/20 outline-none"
              />
            </div>

            {/* Target Examination */}
            <div>
              <label className="block text-xs font-semibold text-obsidian-300 mb-1.5">
                Target Exam
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-obsidian-800 rounded-xl border border-obsidian-700">
                {EXAMS.map((exam) => {
                  const isSelected = targetExam === exam.id
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setTargetExam(exam.id)}
                      className={cn(
                        'py-1.5 text-center text-xs font-bold rounded-lg transition-all cursor-pointer select-none',
                        isSelected
                          ? 'bg-cliniq-pharm text-obsidian-950 shadow-xs'
                          : 'text-obsidian-400 hover:text-white'
                      )}
                    >
                      {exam.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Validation / Error Alert */}
            {validationDetails && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs space-y-0.5">
                {Object.values(validationDetails).flat().map((msg, i) => (
                  <p key={i}>• {msg}</p>
                ))}
              </div>
            )}

            {errorMessage && !validationDetails && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-cliniq-pharm hover:bg-sky-400 text-obsidian-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-obsidian-950" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Enter ClinIQ</span>
                )}
              </button>
            </div>
          </form>

          {/* Simple footer */}
          <div className="pt-2 border-t border-obsidian-800 text-center">
            <p className="text-[11px] text-obsidian-500 leading-relaxed">
              Your clinical progress syncs automatically across devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
