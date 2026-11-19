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
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-[#EFECE4] text-[#161B18] font-sans antialiased">
      <div className="w-full max-w-[380px]">
        
        {/* Editorial ivory card */}
        <div className="bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] shadow-[0_4px_24px_rgba(22,27,24,0.06)] p-6 sm:p-7">
          
          {/* Brand & Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <LogoIcon className="w-10 h-10 rounded-xl" />
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[17px] font-serif font-bold text-[#161B18] tracking-tight">Clinical</span>
              <span className="text-[17px] font-serif font-bold text-[#2E5740] tracking-tight">Recall</span>
            </div>

            <h1 className="text-[20px] font-serif font-bold text-[#161B18] tracking-tight">
              Welcome to Clinical Recall
            </h1>
            <p className="text-[13px] text-[#5C6860] mt-1 font-normal">
              Focused learning. Lasting knowledge.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Name */}
            <div>
              <label 
                htmlFor="full-name" 
                className="block text-[13px] font-medium text-[#202622] mb-1.5"
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
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#DCD6C9] rounded-lg text-[14px] text-[#161B18] placeholder:text-[#8A958E] transition-all focus:bg-[#FDFCF9] focus:border-[#2E5740] focus:ring-2 focus:ring-[#2E5740]/15 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email-address" 
                className="block text-[13px] font-medium text-[#202622] mb-1.5"
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
                className="w-full h-10 px-3 bg-[#FAF8F5] border border-[#DCD6C9] rounded-lg text-[14px] text-[#161B18] placeholder:text-[#8A958E] transition-all focus:bg-[#FDFCF9] focus:border-[#2E5740] focus:ring-2 focus:ring-[#2E5740]/15 outline-none"
              />
            </div>

            {/* Target Examination */}
            <div>
              <label className="block text-[13px] font-medium text-[#202622] mb-1.5">
                Target Exam
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#EAE5DB] rounded-lg border border-[#DDD6C8]">
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
                          ? "bg-[#1A3626] text-[#FAF8F5] font-semibold shadow-xs" 
                          : "text-[#5C6860] hover:text-[#161B18]"
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
              <div className="p-2.5 rounded-lg bg-[#FAF0EE] border border-[#EED7D2] text-[#8C2B20] text-[12px] space-y-0.5">
                {Object.values(validationDetails).flat().map((msg, i) => (
                  <p key={i}>• {msg}</p>
                ))}
              </div>
            )}

            {errorMessage && !validationDetails && (
              <div className="p-2.5 rounded-lg bg-[#FAF0EE] border border-[#EED7D2] text-[#8C2B20] text-[12px] flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-[#8C2B20]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#1A3626] hover:bg-[#132B1E] active:bg-[#0E2016] text-[#FAF8F5] font-medium text-[14px] rounded-lg border border-[#234532] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#FAF8F5]/80" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </form>

          {/* Simple, peaceful footer */}
          <div className="mt-5 pt-4 border-t border-[#EAE5DB] text-center">
            <p className="text-[12px] text-[#5C6860] leading-relaxed">
              Your clinical progress syncs automatically across devices.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
