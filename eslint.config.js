import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import cypress from 'eslint-plugin-cypress'

export default defineConfig([
  globalIgnores(['dist']),

  // 🔹 Seu config atual
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // BLOCO PARA CYPRESS
  {
    files: ['cypress/**/*.js'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...cypress.environments.globals.globals,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
    },
  },
])
