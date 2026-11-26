import React from 'react'

export function LogoIcon({ className = 'w-9 h-9', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="cliniqGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <radialGradient id="cliniqGlow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#38BDF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="6" y="6" width="108" height="108" rx="30" fill="#111827" stroke="#1F2937" strokeWidth="2" />
      <circle cx="60" cy="60" r="42" fill="url(#cliniqGlow)" />
      {/* ClinIQ C mark */}
      <path
        d="M74 36C66 30 55 28 45 32C30 38 24 51 24 62C24 76 34 88 48 90C59 92 68 88 75 82"
        stroke="url(#cliniqGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* ClinIQ Pulse / Q slash */}
      <path
        d="M52 64L62 48L72 74L80 58L88 64"
        stroke="#38BDF8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="90" cy="30" r="5" fill="#FBBF24" />
    </svg>
  )
}

export function LogoFull({ className = 'h-9 w-auto', ...props }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon className="w-8 h-8 shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[17px] font-extrabold font-sans tracking-tight text-white">
            Clin
          </span>
          <span className="text-[17px] font-extrabold font-sans tracking-tight text-cliniq-pharm">
            IQ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cliniq-trap ml-0.5 mb-1 shrink-0" />
        </div>
        <span className="text-[9px] font-mono tracking-widest uppercase text-obsidian-400 -mt-1 font-semibold">
          MedRecall
        </span>
      </div>
    </div>
  )
}

export default function Logo({
  variant = 'full',
  className,
  size,
  ...props
}) {
  if (variant === 'icon' || variant === 'mark') {
    return <LogoIcon className={className || 'w-9 h-9'} {...props} />
  }

  return <LogoFull className={className || 'h-9 w-auto'} {...props} />
}
