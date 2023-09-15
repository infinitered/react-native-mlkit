module.exports = {
  extends: ["turbo", "prettier", "universe/native"],
  rules: {},
  parserOptions: {
    ecmaVersion: 2022,
    env: {
      es2021: true,
    },
  },
};
