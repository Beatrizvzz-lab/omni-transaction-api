const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.service.ts', 'src/**/*.controller.ts'],
};
