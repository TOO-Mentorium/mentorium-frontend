const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    "eslint:recommended", 
    "eslint-config-turbo",
    "plugin:prettier/recommended",
  ],
  plugins: ["only-warn", "prettier"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
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
  }
};
