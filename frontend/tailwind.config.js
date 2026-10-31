/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F3ED',
        sand: '#E9E3D8',
        ink: '#171717',
        muted: '#85847F',
        sage: {
          DEFAULT: '#BFD7D0',
          light: '#DCE9E4',
          dark: '#8FB3A8',
        },
        coral: {
          DEFAULT: '#E47758',
          light: '#F3C4B5',
          dark: '#C85F42',
        },
        lavender: {
          DEFAULT: '#C9C8DA',
          light: '#E1E0EB',
          dark: '#9F9DB8',
        },
        line: '#EAE7DF',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '24px',
        xl4: '28px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23, 23, 23, 0.04), 0 8px 24px -12px rgba(23, 23, 23, 0.10)',
        lift: '0 2px 4px rgba(23, 23, 23, 0.05), 0 18px 40px -16px rgba(23, 23, 23, 0.18)',
        panel: '0 24px 64px -24px rgba(23, 23, 23, 0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
