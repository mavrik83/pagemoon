/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
module.exports = {
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
            },
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
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
                display: 'display',
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
};
