/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: '#E8EFF6',
        input: '#E2EAF2',
        ring: '#2563EB',
        background: '#F4F8FD',
        foreground: '#172B4D',
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
        brand: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          'blue-light': '#EFF6FF',
          'blue-surface': '#DBEAFE',
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        card: '0 2px 10px -1px rgba(23, 43, 77, 0.05), 0 1px 4px -1px rgba(23, 43, 77, 0.03)',
        floating: '0 12px 30px -4px rgba(23, 43, 77, 0.08), 0 4px 12px -2px rgba(23, 43, 77, 0.04)',
        hover: '0 10px 25px -5px rgba(23, 43, 77, 0.08), 0 8px 10px -6px rgba(23, 43, 77, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
