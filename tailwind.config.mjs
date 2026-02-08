/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        category: {
          gas: '#0F9D58',
          discord: '#5865F2',
          'ai-api': '#FF6B35',
          'no-code': '#7C3AED',
          frameworks: '#2563EB',
          reviews: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: '#374151',
            h2: { color: '#111827', marginTop: '2em' },
            h3: { color: '#111827', marginTop: '1.5em' },
            a: { color: '#2563EB', textDecoration: 'underline' },
            code: {
              backgroundColor: '#F3F4F6',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
