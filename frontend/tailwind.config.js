/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669',   // emerald-600
          light: '#d1fae5',  // emerald-100
        },
        secondary: '#f59e0b', // amber-500
        accent: '#facc15',    // yellow-400
        danger: '#ef4444',    // red-500
        success: '#10b981',   // emerald-500
        'bg-main': '#f8fafc', // slate-50
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
