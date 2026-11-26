import React, { useId } from 'react'
import { cn } from '../utils/cn'

/**
 * AnimatedDoctorGuide:
 * A distinctive, ultra-smooth clinical doctor vector illustration holding a medical guideline clipboard.
 * Features:
 * - Crisp SVG: White lab coat, navy scrubs, stethoscope, glasses/smile.
 * - Medical clipboard held in both hands with guideline checkmark rows.
 * - Live amber pulse alert (⚡) blinking at the top corner of clipboard.
 * - Gentle lifelike 60fps breathing float (animate-doctor-breathe).
 */
export default function AnimatedDoctorGuide({
  className = 'w-14 h-16',
  hasAlert = true,
  onClick,
}) {
  const rawId = useId()
  const uid = rawId.replace(/:/g, '')

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center select-none cursor-pointer group touch-manipulation',
        className
      )}
      style={{
        filter: 'drop-shadow(0 4px 12px rgba(10, 15, 30, 0.55))',
      }}
      title="Click to open Clinical Guidelines Sheet"
    >
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-200 group-hover:scale-105 group-active:scale-95 animate-doctor-breathe"
      >
        <defs>
          <linearGradient id={`coatGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id={`scrubGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id={`clipGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Soft Ground Shadow */}
        <ellipse cx="50" cy="115" rx="34" ry="4.5" fill="#000000" fillOpacity="0.45" />

        {/* Doctor Shoes */}
        <ellipse cx="42" cy="113" rx="7" ry="3.5" fill="#0A0F1D" />
        <ellipse cx="58" cy="113" rx="7" ry="3.5" fill="#0A0F1D" />

        {/* Scrub Pants (Deep Hospital Navy) */}
        <path
          d="M37 92L41 112H46L49 92H51L54 112H59L63 92H37Z"
          fill="#0F172A"
        />

        {/* Body: Scrub Shirt */}
        <path
          d="M36 50L34 88H66L64 50H36Z"
          fill={`url(#scrubGrad-${uid})`}
        />

        {/* White Lab Coat (Left & Right Flaps) */}
        <path
          d="M31 52L27 94C27 94 34 96 38 95L40 54L31 52Z"
          fill={`url(#coatGrad-${uid})`}
          stroke="#CBD5E1"
          strokeWidth="0.5"
        />
        <path
          d="M69 52L73 94C73 94 66 96 62 95L60 54L69 52Z"
          fill={`url(#coatGrad-${uid})`}
          stroke="#CBD5E1"
          strokeWidth="0.5"
        />

        {/* Stethoscope around neck */}
        <path
          d="M40 45C38 52 38 60 41 66C44 71 49 72 51 72C53 72 58 71 61 66C63 60 63 52 61 45"
          stroke="#94A3B8"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Stethoscope chestpiece */}
        <circle cx="51" cy="74" r="3.2" fill="#38BDF8" stroke="#0F172A" strokeWidth="1" />

        {/* Neck */}
        <rect x="46" y="38" width="8" height="8" rx="2" fill="#FDE68A" />

        {/* Head */}
        <circle cx="50" cy="28" r="13.5" fill="#FDE68A" />

        {/* Doctor Hair / Surgical Cap */}
        <path
          d="M36 28C36 18 41 14 50 14C59 14 64 18 64 28C64 29 63 31 60 30C57 29 55 24 50 24C45 24 43 29 40 30C37 31 36 29 36 28Z"
          fill="#1E3A8A"
        />

        {/* Friendly Clinical Eyes & Glasses */}
        <circle cx="45" cy="28" r="1.6" fill="#0F172A" />
        <circle cx="55" cy="28" r="1.6" fill="#0F172A" />
        {/* Modern glasses frame */}
        <rect x="41" y="24" width="8" height="7" rx="2" stroke="#334155" strokeWidth="1.1" fill="none" />
        <rect x="51" y="24" width="8" height="7" rx="2" stroke="#334155" strokeWidth="1.1" fill="none" />
        <path d="M49 27H51" stroke="#334155" strokeWidth="1.1" />
        {/* Confident Smile */}
        <path d="M47 34C48.5 35.5 51.5 35.5 53 34" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

        {/* CLINICAL CLIPBOARD HELD IN BOTH HANDS */}
        <g className="transition-transform duration-200 group-hover:-translate-y-1">
          {/* Clipboard Backboard */}
          <rect
            x="35"
            y="55"
            width="30"
            height="38"
            rx="3.5"
            fill={`url(#clipGrad-${uid})`}
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Top Metallic Clip */}
          <rect x="43" y="52" width="14" height="5" rx="1.5" fill="#94A3B8" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="50" cy="54.5" r="1" fill="#0F172A" />

          {/* Crisp White Medical Sheet */}
          <rect x="38" y="58" width="24" height="32" rx="1.5" fill="#FFFFFF" />

          {/* Clinical Checkmarks & Guidelines Rows */}
          <path d="M41 63H55" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M41 68H57" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M41 73H55" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M41 78H52" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

          {/* Medical Checkmark on sheet */}
          <path d="M41 83L42.5 84.5L45.5 81.5" stroke="#10B981" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M47 83H56" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

          {/* Live Amber Pulse Alert (⚡) Blink at top corner of clipboard */}
          {hasAlert && (
            <g transform="translate(56, 54)">
              {/* Pulsing wave circle */}
              <circle cx="5" cy="5" r="5.5" fill="#F59E0B" opacity="0.5" className="animate-ping" />
              {/* Amber base badge */}
              <circle cx="5" cy="5" r="4.5" fill="#D97706" stroke="#FFFFFF" strokeWidth="0.9" />
              {/* Crisp Lightning Bolt ⚡ */}
              <path
                d="M5.5 2.5L3.8 5.2H5.2L4.5 7.5L6.5 4.5H5.1L5.5 2.5Z"
                fill="#FEF3C7"
              />
            </g>
          )}

          {/* Doctor's Both Hands Holding the Clipboard */}
          <ellipse cx="35" cy="74" rx="3.5" ry="4.5" fill="#FDE68A" stroke="#0F172A" strokeWidth="0.8" />
          <ellipse cx="65" cy="74" rx="3.5" ry="4.5" fill="#FDE68A" stroke="#0F172A" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  )
}
