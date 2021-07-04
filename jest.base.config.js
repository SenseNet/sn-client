module.exports = {
  coveragePathIgnorePatterns: ['index.ts', 'examples'],
  setupFiles: ['<rootDir>/../../jest/global-setup.js'],
  moduleNameMapper: {
    '^@sensenet/list-controls-react(/src/ContentList)?(.*)$':
      '<rootDir>/../../packages/sn-list-controls-react/src/ContentList/$2',
    '^@sensenet/([^/]*)(/src)?(.*)$': '<rootDir>/../../packages/sn-$1/src$3',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true, // comment out this and uncomment the line below to check for typescript errors
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRunner: 'jest-jasmine2',
}
