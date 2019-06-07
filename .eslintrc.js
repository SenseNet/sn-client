module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:cypress/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'cypress'],
  env: { browser: true, node: true, es6: true, jest: true, 'cypress/globals': true },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': 'off',
    'no-console': 'off',
    'react/prop-types': 'skipUndeclared',
    '@typescript-eslint/no-unused-vars': 'off', // Use Typescript own check for this
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'prettier/prettier': 'error',
  },
}
