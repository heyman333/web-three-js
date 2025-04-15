import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowDefaultExport: true,
        },
      ],
      '@typescript-eslint/no-shadow': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'import/no-unresolved': 'off',
      'semi': 'off',
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "ignoreRestSiblings": true,
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_"
        }
      ],
    },
  },
)
