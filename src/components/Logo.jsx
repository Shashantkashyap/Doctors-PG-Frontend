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
      <rect x="8" y="8" width="104" height="104" rx="28" fill="#111D35" />
      <path
        d="M72 34C65 29 56 27 47 30C32 34 25 47 25 60C25 75 35 87 49 90C58 92 67 89 74 84"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M59 47C68 38 82 40 87 49C93 60 85 72 73 73H59L88 91"
        stroke="#6B9DFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="30" r="4" fill="#65DDB0" />
    </svg>
  )
}

export function LogoFull({ className = 'h-9 w-auto', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 440 120"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="8" y="8" width="104" height="104" rx="28" fill="#111D35" />
      <path
        d="M72 34C65 29 56 27 47 30C32 34 25 47 25 60C25 75 35 87 49 90C58 92 67 89 74 84"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M59 47C68 38 82 40 87 49C93 60 85 72 73 73H59L88 91"
        stroke="#6B9DFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="30" r="4" fill="#65DDB0" />
      <text
        x="132"
        y="59"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="34"
        fontWeight="650"
        letterSpacing="-1.5"
        fill="#111D35"
      >
        Clinical
      </text>
      <text
        x="132"
        y="94"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="34"
        fontWeight="750"
        letterSpacing="-1.5"
        fill="#2869E8"
      >
        Recall
      </text>
    </svg>
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
