import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default defineConfig([
    js.configs.recommended,
    {
        files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'], // Линтинг только в папке src
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            'react/react-in-jsx-scope': 'off', // React 17+ не требует импорта React
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Игнорировать переменные, начинающиеся с "_"
            'react/jsx-uses-react': 'off', // Отключить устаревшее правило
            'react/jsx-uses-vars': 'error', // Убедиться, что переменные JSX используются
        },
        settings: {
            react: {
                version: 'detect', // Автоматическое определение версии React
            },
        },
    },
]);
