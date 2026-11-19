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
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 bg-[#EAEFF4] text-[#053F5C] font-sans antialiased">
      <div className="w-full max-w-[380px]">
        
        {/* Crisp white card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(5,63,92,0.06)] p-6 sm:p-7">
          
          {/* Brand & Heading */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <LogoIcon className="w-10 h-10 rounded-xl" />
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="text-[17px] font-bold text-[#053F5C] tracking-tight">Clinical</span>
              <span className="text-[17px] font-bold text-[#429EBD] tracking-tight">Recall</span>
            </div>

            <h1 className="text-[20px] font-bold text-[#053F5C] tracking-tight">
              Welcome to Clinical Recall
            </h1>
            <p className="text-[13px] text-[#5C768D] mt-1 font-normal">
              Focused learning. Lasting knowledge.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Name */}
            <div>
              <label 
                htmlFor="full-name" 
                className="block text-[13px] font-semibold text-[#053F5C] mb-1.5"
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
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[14px] text-[#053F5C] placeholder:text-[#889DA8] transition-all focus:bg-white focus:border-[#429EBD] focus:ring-2 focus:ring-[#429EBD]/20 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email-address" 
                className="block text-[13px] font-semibold text-[#053F5C] mb-1.5"
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
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-[14px] text-[#053F5C] placeholder:text-[#889DA8] transition-all focus:bg-white focus:border-[#429EBD] focus:ring-2 focus:ring-[#429EBD]/20 outline-none"
              />
            </div>

            {/* Target Examination */}
            <div>
              <label className="block text-[13px] font-semibold text-[#053F5C] mb-1.5">
                Target Exam
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#E2ECF2] rounded-lg border border-[#C5E6F1]">
                {EXAMS.map((exam) => {
                  const isSelected = targetExam === exam.id
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setTargetExam(exam.id)}
                      className={cn(
                        "py-1.5 text-center text-[13px] font-semibold rounded-md transition-all cursor-pointer select-none",
                        isSelected 
                          ? "bg-[#053F5C] text-white shadow-xs" 
                          : "text-[#5C768D] hover:text-[#053F5C]"
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
              <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] space-y-0.5">
                {Object.values(validationDetails).flat().map((msg, i) => (
                  <p key={i}>• {msg}</p>
                ))}
              </div>
            )}

            {errorMessage && !validationDetails && (
              <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-[#DC2626]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#053F5C] hover:bg-[#032B40] text-white font-semibold text-[14px] rounded-lg border border-[#084869] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
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
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center">
            <p className="text-[12px] text-[#5C768D] leading-relaxed">
              Your clinical progress syncs automatically across devices.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
