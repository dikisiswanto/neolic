module.exports = {
  ignores: ["node_modules/", ".next/"],
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    indent: ["error", 2],
    "react/react-in-jsx-scope": "off",
    "@next/next/no-img-element": "off",
    "prettier/prettier": [
      "error",
      { endOfLine: "auto", tabWidth: 2, useTabs: false },
    ],
  },
};
