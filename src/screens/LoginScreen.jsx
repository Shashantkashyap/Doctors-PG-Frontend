import React, { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { LogoIcon } from '../components/Logo'
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-[#F9FAFB] text-[#111827] font-sans antialiased">
      <div className="w-full max-w-[380px]">
        
        {/* Clean, calm card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-7">
          
          {/* Brand & Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <LogoIcon className="w-10 h-10 rounded-xl" />
            </div>

            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-[17px] font-bold text-[#111827] tracking-tight">Clinical</span>
              <span className="text-[17px] font-bold text-[#2563EB] tracking-tight">Recall</span>
            </div>

            <h1 className="text-[20px] font-semibold text-[#111827] tracking-tight">
              Welcome to Clinical Recall
            </h1>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Your focused companion for clinical excellence.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Name */}
            <div>
              <label 
                htmlFor="full-name" 
                className="block text-[13px] font-medium text-[#374151] mb-1.5"
              >
                Name
              </label>
              <input
                id="full-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Aarav Sharma"
                autoComplete="name"
                required
                className="w-full h-10 px-3 bg-white border border-[#D1D5DB] rounded-lg text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email-address" 
                className="block text-[13px] font-medium text-[#374151] mb-1.5"
              >
                Email
              </label>
              <input
                id="email-address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@hospital.edu"
                autoComplete="email"
                required
                className="w-full h-10 px-3 bg-white border border-[#D1D5DB] rounded-lg text-[14px] text-[#111827] placeholder:text-[#9CA3AF] transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none"
              />
            </div>

            {/* Target Examination */}
            <div>
              <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
                Target Exam
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F4F6] rounded-lg border border-[#E5E7EB]">
                {EXAMS.map((exam) => {
                  const isSelected = targetExam === exam.id
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setTargetExam(exam.id)}
                      className={cn(
                        "py-1.5 text-center text-[13px] font-medium rounded-md transition-all cursor-pointer select-none",
                        isSelected 
                          ? "bg-white text-[#111827] font-semibold shadow-sm" 
                          : "text-[#6B7280] hover:text-[#111827]"
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
              <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] text-[12px] space-y-0.5">
                {Object.values(validationDetails).flat().map((msg, i) => (
                  <p key={i}>• {msg}</p>
                ))}
              </div>
            )}

            {errorMessage && !validationDetails && (
              <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] text-[12px] flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-[#DC2626]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#111827] hover:bg-[#1F2937] active:bg-[#030712] text-white font-medium text-[14px] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white/80" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>

          {/* Simple, peaceful footer */}
          <div className="mt-5 pt-4 border-t border-[#F3F4F6] text-center">
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              Your clinical progress syncs automatically across devices.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
