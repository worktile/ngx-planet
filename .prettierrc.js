module.exports = {
    eslintIntegration: true,
    stylelintIntegration: true,
    tabWidth: 2,
    semi: true,
    printWidth: 140,
    proseWrap: 'preserve',
    trailingComma: 'none',
    singleQuote: true,
    arrowParens: 'avoid',
    bracketSameLine: true,
    overrides: [
        {
            files: '*.js',
            options: {
                tabWidth: 4
            }
        },
        {
            files: '*.ts',
            options: {
                tabWidth: 4
            }
        },
        {
            files: '*.scss',
            options: {
                tabWidth: 4
            }
        },
        {
            files: '*.css',
            options: {
                tabWidth: 4
            }
        }
    ]
};
