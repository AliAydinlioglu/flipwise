import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

const tsConfigs = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["build"],
  },
  {
    files: ["**/*.ts", "**/*.spec.ts"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],
      "@typescript-eslint/no-unused-vars": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/no-tabs": ["error"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "@stylistic/no-inner-declarations": "off",
      "@typescript-eslint/no-inner-declarations": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  }
);

export default tsConfigs;
