/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: '#E5EDF5',
        input: '#E2EAF2',
        ring: '#0265DC',
        background: '#FFFFFF',
        foreground: '#0A0A0A',
        brand: {
          DEFAULT: '#0265DC',
          deep: '#0047A5',
          blue: '#0265DC',
          'blue-hover': '#0047A5',
          'blue-light': '#F5F9FF',
          'blue-surface': '#E8F2FD',
        },
        'tint-blue': '#E8F2FD',
        cyan: {
          DEFAULT: '#14C4F4',
          accent: '#14C4F4',
        },
        navy: {
          DEFAULT: '#172B4D',
          dark: '#0B1727',
          muted: '#2D3F5D',
        },
        slate: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
          subtle: '#F8FAFC',
          border: '#E2E8F0',
        },
        risk: {
          low: '#10B981',
          'low-bg': '#ECFDF5',
          moderate: '#F59E0B',
          'moderate-bg': '#FFFBEB',
          high: '#F97316',
          'high-bg': '#FFF7ED',
          critical: '#EF4444',
          'critical-bg': '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        card: '0 2px 10px -1px rgba(23, 43, 77, 0.05), 0 1px 4px -1px rgba(23, 43, 77, 0.03)',
        floating: '0 16px 38px -24px rgba(15, 23, 42, 0.3)',
        brand: '0 10px 25px -5px rgba(2, 101, 220, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
