const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    require.resolve('@vercel/style-guide/eslint/browser'),
    require.resolve('@vercel/style-guide/eslint/react'),
    require.resolve('@vercel/style-guide/eslint/next'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    "eslint:recommended",
    "plugin:prettier/recommended",
    "eslint-config-turbo"
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    ".*.js",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
  rules: {
    "no-console": "error",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "semi": ["error", "never"],
    "import/no-default-export": "off",
    "prettier/prettier": ["error", {
      useTabs: false,
      tabWidth: 2,
      singleQuote: true,
      trailingComma: "all",
      semi: false,
      arrowParens: "always",
      bracketSpacing: true,
      endOfLine: "lf",
      printWidth: 80
     }      
    ],
    "import/no-anonymous-default-export": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
};
