const path = require('path')

module.exports = {
  rootDir: '../..',
  setupFiles: ['<rootDir>/apps/sensenet/test/setup.js'],
  testEnvironment: require.resolve('jest-environment-jsdom', {
    paths: [path.resolve(__dirname, '../../packages/sn-auth-react')],
  }),
  modulePathIgnorePatterns: [
    '<rootDir>/packages/sn-controls-react/test/__mocks__',
    '<rootDir>/packages/sn-control-mapper/test/__mocks__',
  ],
  moduleNameMapper: {
    '^@sensenet/list-controls-react$': '<rootDir>/packages/sn-list-controls-react/src/ContentList',
    '^@sensenet/sn-auth-react$': '<rootDir>/packages/sn-auth-react/src',
    '^@sensenet/(.*)$': '<rootDir>/packages/sn-$1/src',
    '^react$': path.dirname(require.resolve('react/package.json')),
    '^react-dom(.*)$': `${path.dirname(require.resolve('react-dom/package.json'))}$1`,
    '^@material-ui/core(.*)$': `${path.dirname(require.resolve('@material-ui/core/package.json'))}$1`,
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        tsconfig: {
          target: 'ES2019',
          module: 'CommonJS',
          jsx: 'react',
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    ],
    'ag-grid-react/lib/reactUi/header/headerCellComp\\.js$': '<rootDir>/apps/sensenet/loaders/ag-grid-react-aria.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!ag-grid-react/lib/reactUi/header/headerCellComp\\.js$)'],
  testMatch: [
    '<rootDir>/apps/sensenet/test/**/*.test.ts?(x)',
    '<rootDir>/packages/sn-auth-react/test/**/*.test.ts?(x)',
  ],
}
