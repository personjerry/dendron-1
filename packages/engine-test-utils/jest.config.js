const jestConfig = require("../../jest.config");

const TEST_FILES_REGEX = '.*engine-test-utils.*(/test/.*|(\\.|/)(test|spec))\\.ts$';

module.exports = {
  ...jestConfig,
  testEnvironment: "jest-environment-jsdom-sixteen",
  collectCoverage: true,
  /** According to this post https://stackoverflow.com/a/59717197/7858768
   *  Jest will only pick up code coverage from files that are within the root
   *  dir hierarchy.*/
  rootDir: "./../",
  testRegex: TEST_FILES_REGEX,
  collectCoverageFrom: [
   // "**/src/**/*",

    // Exclude snapshots from code coverage tests:
    "!**/__snapshots__/**",
  ],
};
