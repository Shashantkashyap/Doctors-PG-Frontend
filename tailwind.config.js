/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070A10',
          900: '#0B0F19', // App canvas background
          800: '#111827', // Card surfaces
          750: '#151D2E', // Inset surfaces
          700: '#1F2937', // Borders & dividers
          600: '#374151', // Subtle active borders
          500: '#4B5563', // Muted text
          400: '#6B7280', // Secondary metadata
          300: '#9CA3AF', // Primary body text
          200: '#E5E7EB', // Subheadings
          100: '#F3F4F6', // Headings
          50: '#F9FAFB',  // High-contrast titles
        },
        // Subject Clinical Accents
        cliniq: {
          pharm: '#38BDF8', // Cyan for Pharmacology
          pharmGlow: 'rgba(56, 189, 248, 0.15)',
          patho: '#818CF8', // Indigo / Purple for Pathology
          pathoGlow: 'rgba(129, 140, 248, 0.15)',
          psm: '#34D399',   // Emerald Green for PSM & Success
          psmGlow: 'rgba(52, 211, 153, 0.15)',
          trap: '#FBBF24',  // Amber for Traps & Warnings
          trapGlow: 'rgba(251, 191, 36, 0.15)',
          danger: '#F87171', // Rose / Red for Contraindications & Errors
          dangerGlow: 'rgba(248, 113, 113, 0.15)',
        },
        navy: {
          50: '#F0F6F9',
          100: '#E1ECF2',
          200: '#B8D5E3',
          300: '#8EBECF',
          400: '#4A8BA8',
          500: '#0E5C84',
          700: '#084869',
          800: '#064260',
          900: '#053F5C',
          950: '#032B40',
        },
        ocean: {
          50: '#F1F9FB',
          100: '#E2F3F8',
          200: '#C5E6F1',
          300: '#94D0E3',
          400: '#5FB1CC',
          500: '#429EBD',
          600: '#3288A5',
          700: '#256E86',
          800: '#1D576A',
        },
        amberGold: {
          50: '#FEFBF5',
          100: '#FEF6E7',
          200: '#FDEBC8',
          300: '#FCDAA0',
          400: '#FAC45E',
          500: '#FBBF24',
          600: '#F7AD19',
          700: '#DC930B',
          800: '#8A5506',
        },
        pharma: {
          subtle: 'rgba(56, 189, 248, 0.08)',
          border: 'rgba(56, 189, 248, 0.25)',
          activeBorder: '#38BDF8',
          accent: '#38BDF8',
          text: '#7DD3FC',
        },
        patho: {
          subtle: 'rgba(129, 140, 248, 0.08)',
          border: 'rgba(129, 140, 248, 0.25)',
          activeBorder: '#818CF8',
          accent: '#818CF8',
          text: '#A5B4FC',
        },
        psm: {
          subtle: 'rgba(52, 211, 153, 0.08)',
          border: 'rgba(52, 211, 153, 0.25)',
          activeBorder: '#34D399',
          accent: '#34D399',
          text: '#6EE7B7',
        },
      },
      fontFamily: {
        serif: [
          '"Newsreader"',
          'Georgia',
          '"Times New Roman"',
          'serif',
        ],
        editorial: [
          '"Newsreader"',
          'Georgia',
          'serif',
        ],
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'sans-serif',
        ],
        outfit: [
          '"Plus Jakarta Sans"',
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
