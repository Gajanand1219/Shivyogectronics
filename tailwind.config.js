/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2545',
          50: '#EDF1F7',
          100: '#D6E0EE',
          400: '#1B3F73',
          600: '#0B2545',
          700: '#081B34',
          900: '#050F1F',
        },
        royal: {
          DEFAULT: '#1E5FCA',
          50: '#EAF1FD',
          100: '#CFE0FA',
          400: '#3A75DA',
          500: '#1E5FCA',
          600: '#164AA0',
        },
        gold: {
          DEFAULT: '#F4B400',
          400: '#FFC72C',
          500: '#F4B400',
          600: '#D99A00',
        },
        brand: {
          red: '#E63946',
          orange: '#F2823A',
        },
      },
      fontFamily: {
        marathi: ['"Noto Sans Devanagari"', 'sans-serif'],
        display: ['"Poppins"', '"Noto Sans Devanagari"', 'sans-serif'],
        body: ['"Inter"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px -8px rgba(11, 37, 69, 0.25)',
        glow: '0 0 40px -5px rgba(244, 180, 0, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dash: {
          to: { strokeDashoffset: 0 },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        dash: 'dash 3s linear forwards',
      },
    },
  },
  plugins: [],
}
