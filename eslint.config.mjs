import { FlatCompat } from "@eslint/eslintrc"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "dist/**",
      "e2e/**",
      "playwright.config.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Prettier 충돌 규칙 비활성화 (반드시 맨 마지막에)
  ...compat.extends("prettier"),
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
]

export default eslintConfig
