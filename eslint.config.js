import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
export default [
  {
    ignores: ["dist", "node_modules"]
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"]
        }
      }
    },
    rules: {
      /* JavaScript esencial */
      "no-undef": "error",
      "no-unused-vars": ["error", {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true
      }],
      "no-unreachable": "error",
      "no-const-assign": "error",
      "no-redeclare": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-irregular-whitespace": "error",

      /* React esencial */
      "react/jsx-no-undef": "error",
      "react/jsx-key": "error",
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "warn",
      /* Hooks */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      /* Fast Refresh / Vite */
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      /* Imports */
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/no-duplicates": "warn",
      files: ["vite.config.js"],
      rules: {
        "import/no-unresolved": "off"
      }
    }
  }
];
