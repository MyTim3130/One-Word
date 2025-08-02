/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#a7f3d0',
          400: '#6ee7b7',
          500: '#22c55e',
          600: '#10b981',
          700: '#047857',
          800: '#166534',
          900: '#064e3b',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
        "primary-gradient": "linear-gradient(135deg, #34d399 0%, #065f46 100%)",
        "secondary-gradient": "linear-gradient(135deg, #a7f3d0 0%, #047857 100%)",
        "accent-gradient": "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(16, 185, 129, 0.15)',
        'glass-strong': '0 12px 40px 0 rgba(16, 185, 129, 0.2)',
        'glow': '0 0 20px rgba(52, 211, 153, 0.3)',
        'glow-strong': '0 0 30px rgba(52, 211, 153, 0.5)',
      },
    },
  },
  plugins: [],
};
