module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  preset: 'ts-jest',
  coveragePathIgnorePatterns: ['node_modules', 'test'],
  globalSetup: './src/test/globalSetup.ts',
}
