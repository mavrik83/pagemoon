/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const { withTV } = require('tailwind-variants/transformer');

/** @type {import('tailwindcss').Config} */
module.exports = withTV({
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: ['Fira Sans Condensed', 'sans-serif'],
        },
        extend: {
            colors: {
                primary: '#07889B',
                secondary: '#E37222',
                tertiary: '#66B9BF',
                highlight: '#EEAA7B',
                alert: '#D93B3B',
                success: '#3BD967',
                'primary-10': 'rgba(7, 136, 155, 0.1)',
                'primary-20': 'rgba(7, 136, 155, 0.2)',
                'primary-30': 'rgba(7, 136, 155, 0.3)',
                'secondary-10': 'rgba(227, 114, 34, 0.1)',
                'secondary-20': 'rgba(227, 114, 34, 0.2)',
                'secondary-30': 'rgba(227, 114, 34, 0.3)',
                'tertiary-10': 'rgba(102, 185, 191, 0.1)',
                'tertiary-20': 'rgba(102, 185, 191, 0.2)',
                'tertiary-30': 'rgba(102, 185, 191, 0.3)',
            },
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
                even: '0 0 10px .05rem rgba(0, 0, 0, 0.5)',
                'even-bg': '0 0 200px 7rem rgba(0, 0, 0, 0.5)',
                'even-bg-md': '0 0 100px 5rem rgba(0, 0, 0, 0.5)',
                'even-bg-sm': '0 0 50px 0.5rem rgba(0, 0, 0, 0.5)',
                blur: '0 0 10px .5rem rgba(0, 0, 0, 0.5)',
            },
            height: {
                'screen-1/2': '50vh',
            },
            keyframes: {
                shimmer: {
                    from: { backgroundPosition: '200% 0' },
                    to: { backgroundPosition: '-200% 0' },
                },
            },
            animation: {
                shimmer: 'shimmer 8s ease-in-out infinite',
            },
            transitionProperty: {
                height: 'height',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms')({
            strategy: 'class', // only generate classes
        }),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
    ],
});
