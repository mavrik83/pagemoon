/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const prettierConfig = {
    printWidth: 80,
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'all',
    semi: true,
    arrowParens: 'always',
    plugins: [require('prettier-plugin-tailwindcss')],
};

module.exports = prettierConfig;
