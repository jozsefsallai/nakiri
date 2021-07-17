module.exports = {
  mode: 'jit',

  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    fontFamily: {
      sans: [
        'Montserrat',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif'
      ]
    },

    colors: {
      'ayame-primary': {
        100: 'var(--ayame-primary-100)',
        200: 'var(--ayame-primary-200)',
        300: 'var(--ayame-primary-300)',
        400: 'var(--ayame-primary-400)',
        500: 'var(--ayame-primary-500)',
        600: 'var(--ayame-primary-600)',
        700: 'var(--ayame-primary-700)',
        800: 'var(--ayame-primary-800)',
        900: 'var(--ayame-primary-900)',
        DEFAULT: 'var(--ayame-primary)'
      },

      'ayame-secondary': {
        100: 'var(--ayame-secondary-100)',
        200: 'var(--ayame-secondary-200)',
        300: 'var(--ayame-secondary-300)',
        400: 'var(--ayame-secondary-400)',
        500: 'var(--ayame-secondary-500)',
        600: 'var(--ayame-secondary-600)',
        700: 'var(--ayame-secondary-700)',
        800: 'var(--ayame-secondary-800)',
        900: 'var(--ayame-secondary-900)',
        DEFAULT: 'var(--ayame-secondary)'
      },

      danger: 'var(--danger)',
      info: 'var(--info)',
      success: 'var(--success)',
      warning: 'var(--warning)',

      gray: 'var(--gray)',

      'discord-dark': 'var(--discord-dark)',
      'discord-gray': 'var(--discord-gray)',

      transparent: 'transparent',
      black: '#000',
      white: '#fff'
    },

    container: {
      center: true
    },

    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square'
    }
  }
};
