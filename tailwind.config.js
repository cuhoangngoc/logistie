/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C9BCF',
        secondary: '#F000B8',
        accent: '#37CDBE',
        neutral: '#3D4451',
        'base-100': '#FFFFFF',
        info: '#3ABFF8',
        success: '#98D8AA',
        warning: '#FBBD23',
        error: '#E76161',
        disabled: '#ccc',
      },
    },
  },
  plugins: [require('daisyui'), require('flowbite/plugin')],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#6C9BCF',
          secondary: '#F000B8',
          accent: '#37CDBE',
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
          info: '#3ABFF8',
          success: '#98D8AA',
          warning: '#FBBD23',
          error: '#E76161',
          disabled: '#CFD2CF',
        },
      },
    ],
  },
};
