// @ts-check
const { defineConfig } = require('eslint/config');
const angular = require('angular-eslint');

module.exports = defineConfig([
    {
        files: ['**/*.ts'],
        extends: [angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'planet',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'planet',
                    style: 'kebab-case'
                }
            ],
            '@angular-eslint/prefer-standalone': 'off',
            '@angular-eslint/prefer-on-push-component-change-detection': 'off'
        }
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended],
        rules: {}
    }
]);
