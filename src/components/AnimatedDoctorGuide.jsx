import React from 'react'
import { cn } from '../utils/cn'

/**
 * AnimatedDoctorGuide:
 * A distinctive, ultra-smooth clinical doctor vector illustration holding a medical guideline clipboard.
 * Includes subtle CSS breathing/floating animation and amber pulse alert on the clipboard.
 */
export default function AnimatedDoctorGuide({
  className = 'w-14 h-16',
  hasAlert = true,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center select-none cursor-pointer group touch-manipulation',
        className
      )}
      style={{
        filter: 'drop-shadow(0 4px 12px rgba(15, 23, 42, 0.45))',
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
          <linearGradient id="coatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="scrubGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="clipboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Soft Ground Shadow */}
        <ellipse cx="50" cy="115" rx="34" ry="4.5" fill="#000000" fillOpacity="0.4" />

        {/* Doctor Shoes */}
        <ellipse cx="42" cy="113" rx="7" ry="3.5" fill="#0F172A" />
        <ellipse cx="58" cy="113" rx="7" ry="3.5" fill="#0F172A" />

        {/* Scrub Pants */}
        <path
          d="M37 92L41 112H46L49 92H51L54 112H59L63 92H37Z"
          fill="#1E293B"
        />

        {/* Body: Scrub Shirt */}
        <path
          d="M36 50L34 88H66L64 50H36Z"
          fill="url(#scrubGradient)"
        />

        {/* White Lab Coat (Left & Right Flaps) */}
        <path
          d="M31 52L27 94C27 94 34 96 38 95L40 54L31 52Z"
          fill="url(#coatGradient)"
        />
        <path
          d="M69 52L73 94C73 94 66 96 62 95L60 54L69 52Z"
          fill="url(#coatGradient)"
        />

        {/* Stethoscope around neck */}
        <path
          d="M40 45C38 52 38 60 41 66C44 71 49 72 51 72C53 72 58 71 61 66C63 60 63 52 61 45"
          stroke="#475569"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Stethoscope chestpiece */}
        <circle cx="51" cy="74" r="3.2" fill="#38BDF8" stroke="#1E293B" strokeWidth="1" />

        {/* Neck */}
        <rect x="46" y="38" width="8" height="8" rx="2" fill="#F87171" fillOpacity="0.25" />
        <rect x="46" y="38" width="8" height="8" rx="2" fill="#FBBF24" fillOpacity="0.35" />

        {/* Head */}
        <circle cx="50" cy="28" r="14" fill="#FCD34D" fillOpacity="0.3" />
        <circle cx="50" cy="28" r="14" fill="#FBBF24" fillOpacity="0.3" />
        <circle cx="50" cy="28" r="13" fill="#FDE68A" />

        {/* Doctor Hair / Surgical Cap */}
        <path
          d="M36 28C36 19 41 14 50 14C59 14 64 19 64 28C64 29 63 31 60 30C57 29 55 24 50 24C45 24 43 29 40 30C37 31 36 29 36 28Z"
          fill="#2563EB"
        />

        {/* Friendly Clinical Eyes & Glasses/Smile */}
        <circle cx="45" cy="28" r="1.6" fill="#0F172A" />
        <circle cx="55" cy="28" r="1.6" fill="#0F172A" />
        {/* Subtle glasses frame */}
        <rect x="41" y="24" width="8" height="7" rx="2" stroke="#334155" strokeWidth="1" fill="none" />
        <rect x="51" y="24" width="8" height="7" rx="2" stroke="#334155" strokeWidth="1" fill="none" />
        <path d="M49 27H51" stroke="#334155" strokeWidth="1" />
        {/* Confident Smile */}
        <path d="M47 34C48.5 35.5 51.5 35.5 53 34" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

        {/* CLINICAL CLIPBOARD HELD IN FRONT */}
        <g className="transition-transform duration-200 group-hover:-translate-y-1">
          {/* Clipboard Backboard */}
          <rect
            x="36"
            y="56"
            width="28"
            height="36"
            rx="3.5"
            fill="url(#clipboardGrad)"
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Top Metallic Clip */}
          <rect x="44" y="53" width="12" height="5" rx="1.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="50" cy="55.5" r="1" fill="#0F172A" />

          {/* Crisp White Medical Sheet */}
          <rect x="39" y="59" width="22" height="30" rx="1.5" fill="#FFFFFF" />

          {/* Clinical Checkmarks & Guidelines Rows */}
          <path d="M42 64H55" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 69H58" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 74H56" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 79H52" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tiny Green Check on sheet */}
          <path d="M42 84L43.5 85.5L46.5 82.5" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 84H57" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

          {/* Alert Notification Dot on Sheet */}
          {hasAlert && (
            <g>
              <circle cx="58" cy="62" r="3.5" fill="#F59E0B" className="animate-ping" opacity="0.75" />
              <circle cx="58" cy="62" r="2.8" fill="#F59E0B" />
              <path d="M58 60.5V62M58 63.5H58.01" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          )}

          {/* Doctor's Hands Holding the Clipboard */}
          <ellipse cx="36" cy="74" rx="3.5" ry="4.5" fill="#FDE68A" stroke="#1E293B" strokeWidth="0.8" />
          <ellipse cx="64" cy="74" rx="3.5" ry="4.5" fill="#FDE68A" stroke="#1E293B" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  )
}
