module.exports = {
  coveragePathIgnorePatterns: ['index.ts', 'examples'],
  globals: {
    'ts-jest': {
      isolatedModules: true, // comment out this and uncomment the line below to check for typescript errors
      // tsConfig: '<rootDir>/tsconfig.test.json',
    },
  },
  preset: 'ts-jest',
}
