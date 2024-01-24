module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["simple-import-sort", "react-refresh", "jsx-a11y", "prettier"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  overrides: [
    // override "simple-import-sort" config
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              // Packages `react` related packages come first.
              ["^react", "^@?\\w"],
              // Internal packages.
              ["^(@|components)(/.*|$)"],
              // Side effect imports.
              ["^\\u0000"],
              ["^~(/app)(/.*|$)"],
              ["^~(/pages)(/.*|$)"],
              ["^~(/widgets)(/.*|$)"],
              ["^~(/features)(/.*|$)"],
              ["^~(/entities)(/.*|$)"],
              ["^~(/shared)(/.*|$)"],
              ["^[./]"],
              // Parent imports. Put `..` last.
              [("^\\.\\.(?!/?$)", "^\\.\\./?$")],
              // Style imports.
              ["^.+\\.?(css)$"],
            ],
          },
        ],
      },
    },
  ],
};
