module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
  globals: {
    __DEV__: true
  }
};
