module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  //For mongoose because it's jsdom isn't good for mongoose
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
