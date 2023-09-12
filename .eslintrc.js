module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-react-native-mlkit`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
