module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', 'index.ts', '[eE]xample.*'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.test.json',
      isolatedModules: true,
      diagnostics: {
        warnOnly: !process.env.CI,
      },
    },
  },
  preset: 'ts-jest',
  transformIgnorePatterns: ['^.+\\.js$'],
}
