module.exports = {
  extends: ["turbo", "prettier", "universe/native"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
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
