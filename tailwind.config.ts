import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#FAF9F7',
        surface: '#FFFFFF',
        heading: '#1A1A17',
        body: '#4A4842',
        muted: '#7A776F',
        border: '#E6E3DD',
        'border-strong': '#CFCBC2',
        primary: '#B8664F',
        'primary-hover': '#9E533F',
        'primary-soft': '#F7E9E1',
        sage: '#708C78',
        'sage-soft': '#EAF0EB',
        blue: '#597A9A',
        'blue-soft': '#E9F0F5',
        success: '#4F7D5B',
        warning: '#B98542',
        danger: '#B7534C',
      },
      boxShadow: { card: '0 1px 3px rgba(26, 26, 23, 0.05)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config;
