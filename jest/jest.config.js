module.exports = {
  rootDir: '../',
  bail: true,
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^pages$': '<rootDir>/src/pages',
    '^utils$': '<rootDir>/src/utils',
  },
  preset: 'ts-jest',
  testRegex: '.*\\.ts$',
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.js'],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
      diagnostics: true,
    },
  },
};
