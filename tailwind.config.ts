import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        accent: {
          DEFAULT: '#7C3AED',
          soft: '#A855F7',
          glow: '#C084FC'
        }
      },
      boxShadow: {
        glow: '0 25px 70px rgba(124,58,237,0.35)'
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseSoft: 'pulseSoft 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        pulseSoft: {
          '0%,100%': { opacity: 0.25 },
          '50%': { opacity: 0.6 }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        pokedex: {
          primary: '#6366F1',
          secondary: '#EC4899',
          accent: '#06B6D4',
          neutral: '#1E1B4B',
          'base-100': '#050816',
          info: '#38BDF8',
          success: '#22C55E',
          warning: '#FBBF24',
          error: '#F87171'
        }
      }
    ]
  }
} satisfies Config
