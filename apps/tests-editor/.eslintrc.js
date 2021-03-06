module.exports = {
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "project": "apps/tests-editor/tsconfig.app.json",
    createDefaultProgram: true,
  },
  rules: {},
  extends: [
    '../../.eslintrc',
    'plugin:vue/essential',
    '@vue/typescript/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ['!**/*'],
};
