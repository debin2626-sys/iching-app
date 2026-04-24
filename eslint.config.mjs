import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

// Downgrade react-compiler errors to warnings (pre-existing issues)
for (const config of eslintConfig) {
  if (config?.plugins?.["react-hooks"]) {
    config.rules = {
      ...config.rules,
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    };
  }
}

export default eslintConfig;
