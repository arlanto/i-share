export default {
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // coveragePathIgnorePatterns: ['/node_modules/'],
  // coverageProvider: 'v8',
  // coverageReporters: ['json', 'text', 'lcov', 'clover'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  moduleNameMapper: {
    '~/(.*)$': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
}
