/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Editorial Luxury Studio Palette
        ivory: '#F8F3EB',
        paper: '#FFFDF9',
        sand: {
          50: '#FAF6F0',
          100: '#F5EFE7',
          200: '#EDE4D8',
          DEFAULT: '#E8D8C5',
          300: '#E8D8C5',
          400: '#D5BEA6',
          500: '#C2A387',
        },
        espresso: {
          DEFAULT: '#45352F',
          light: '#5C4841',
          dark: '#2B211D',
          muted: '#73615A',
        },
        olive: {
          DEFAULT: '#77785A',
          light: '#8D8E6F',
          dark: '#5E5F46',
        },
        burgundy: {
          DEFAULT: '#783E46',
          light: '#914E57',
          dark: '#5E2F36',
        },
        wine: {
          950: '#150305',
          900: '#26060A',
          800: '#420B13',
          700: '#5F111D',
          600: '#7E1727',
          500: '#9E1C31',
        },
        champagne: {
          100: '#FAF6EE',
          200: '#F5E8BA',
          300: '#ECD88C',
          400: '#E0C25E',
          500: '#D4AF37',
          600: '#B59124',
          700: '#8A6D17',
        },
        parchment: {
          50: '#FDFBF7',
          100: '#FAF5EF',
          200: '#F3EADF',
          300: '#E7D8C4',
          400: '#D4BFA5',
        },
        emeraldGreen: {
          950: '#03170E',
          900: '#062B1C',
          800: '#0A422D',
          700: '#0E5C40',
          600: '#147D57',
          500: '#1AA272',
        },
        marigold: {
          100: '#FFF7E6',
          200: '#FDE4B3',
          300: '#F9CE75',
          400: '#F3B438',
          500: '#E29712',
          600: '#B8740A',
        },
        raniPink: {
          100: '#FDF0F5',
          200: '#F9D1E4',
          300: '#F39FC4',
          400: '#E55997',
          500: '#CE2672',
          600: '#A41555',
        },
        sage: {
          100: '#F3F6F2',
          200: '#DEE7DC',
          300: '#C0D1BD',
          400: '#9DB39A',
          500: '#789374',
          600: '#587055',
        },
        midnight: {
          950: '#040711',
          900: '#081024',
          800: '#0F1E40',
          700: '#172C5B',
          600: '#234182',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', 'cursive'],
        cinzel: ['"Cinzel"', 'serif'],
        cinzelDeco: ['"Cinzel Decorative"', 'serif'],
        amiri: ['"Amiri"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'atelier': '0 10px 30px -5px rgba(69, 53, 47, 0.08), 0 0 0 1px rgba(232, 216, 197, 0.6)',
        'atelier-hover': '0 20px 40px -10px rgba(69, 53, 47, 0.14), 0 0 0 1px rgba(212, 175, 55, 0.35)',
        'atelier-card': '0 4px 20px -2px rgba(69, 53, 47, 0.05), 0 0 0 1px rgba(232, 216, 197, 0.5)',
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.25)',
        'wine-glow': '0 15px 40px -10px rgba(120, 62, 70, 0.22)',
      },
      animation: {
        'shimmer': 'shimmer 4s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
};
