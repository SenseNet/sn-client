module.exports = {
  coveragePathIgnorePatterns: ['index.ts', 'examples'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  setupFiles: ['<rootDir>/../../jest/global-setup.js'],
  globals: {
    'ts-jest': {
      isolatedModules: true, // comment out this and uncomment the line below to check for typescript errors
      // tsConfig: '<rootDir>/tsconfig.test.json',
    },
  },
  preset: 'ts-jest',
}
