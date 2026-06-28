module.exports = {
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
  useFonts: jest.fn(() => [true]),
};