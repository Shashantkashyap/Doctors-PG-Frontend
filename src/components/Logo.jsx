import React from 'react'

export function LogoIcon({ className = 'w-8 h-8', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      {...props}
    >
      {/* Matte Titanium Container */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="24"
        fill="#121622"
        stroke="#232B40"
        strokeWidth="2"
      />
      {/* Surgical Cross & Precision Pulse */}
      <path
        d="M50 24V76M24 50H76"
        stroke="#2563EB"
        strokeWidth="5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Medical EKG ECG Wave overlay */}
      <path
        d="M26 50H40L46 36L54 64L60 44L66 50H74"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Focused Vital Dot */}
      <circle cx="74" cy="50" r="3" fill="#60A5FA" />
    </svg>
  )
}

export function LogoFull({ className = 'h-8 w-auto', ...props }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon className="w-7 h-7 shrink-0" />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[16px] font-extrabold font-sans tracking-tight text-white">
            Clin
          </span>
          <span className="text-[16px] font-extrabold font-sans tracking-tight text-blue-400">
            IQ
          </span>
        </div>
        <span className="text-[8.5px] font-mono tracking-widest uppercase text-zinc-400 -mt-1 font-semibold">
          MedRecall
        </span>
      </div>
    </div>
  )
}

export default LogoFull
