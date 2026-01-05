import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

const config = [
  {
    ignores: ["node_modules/**", ".next/**", "target/**", "public/**"],
  },
  ...nextCoreWebVitals,
]

export default config
