/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Light Theme colors
        light: {
          bg: '#f8fafc',        // slate-50
          card: '#ffffff',       // white
          hover: '#f1f5f9',      // slate-100
        },
        border: {
          DEFAULT: '#e2e8f0',    // slate-200
          hover: '#cbd5e1',      // slate-300
        },
        text: {
          primary: '#1e293b',    // slate-800
          secondary: '#64748b',  // slate-500
          muted: '#94a3b8',      // slate-400
        },
        accent: {
          blue: '#3b82f6',
          'blue-hover': '#2563eb',
          green: '#10b981',
          'green-hover': '#059669',
          red: '#ef4444',
          'red-hover': '#dc2626',
          orange: '#f97316',
          'orange-hover': '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
