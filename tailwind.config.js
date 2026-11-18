/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#141C2E',
          925: '#0B0F19',
          950: '#070A12',
        },
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
        },
        pharma: {
          subtle: '#F0FDF4',
          border: '#DCFCE7',
          activeBorder: '#86EFAC',
          accent: '#16A34A',
          text: '#14532D',
        },
        patho: {
          subtle: '#FFF1F2',
          border: '#FFE4E6',
          activeBorder: '#FDA4AF',
          accent: '#E11D48',
          text: '#881337',
        },
        psm: {
          subtle: '#F0F7FF',
          border: '#E0EFFF',
          activeBorder: '#93C5FD',
          accent: '#2563EB',
          text: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'sans-serif',
        ],
        outfit: [
          '"Outfit"',
          '"Inter"',
          '-apple-system',
          'sans-serif',
        ],
        inter: [
          '"Inter"',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 3px 10px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 16px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'dock': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'spotlight': '0 16px 40px -6px rgba(0, 0, 0, 0.10), 0 6px 16px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
    },
  },
  plugins: [],
}
