module.exports = {
  root: true,
  extends: [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "prettier",
  ],
  plugins: [
    "import",
    "jsx-a11y",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
    mocha: true,
  },
  globals: {
    chai: false,
    expect: false,
    describe: false,
    sinon: false,
  },
  rules: {
    "import/prefer-default-export": "off",
    "import/newline-after-import": "off",
  }
};
