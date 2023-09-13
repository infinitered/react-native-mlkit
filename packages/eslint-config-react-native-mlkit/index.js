module.exports = {
  extends: ["turbo", "prettier", "universe/native"],
  rules: {

  },
  parserOptions: {
    ecmaVersion: 2022,
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
    env: {
      es2021: true,
    },
  },
};
