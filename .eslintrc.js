module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: { browser: true, node: true, es6: true, jest: true },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    project: './tsconfig-base.json',
    warnOnUnsupportedTypeScriptVersion: false,
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
  },
}
