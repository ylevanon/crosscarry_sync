module.exports = {
  root: true,
  extends: [
    "universe/native",
    "prettier"
  ],
  plugins: [
    "react",
    "react-native",
    "@typescript-eslint"
  ],
  rules: {
    // React Native specific rules
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "warn",
    "react-native/no-raw-text": ["warn", {
      "skip": ["Text"]
    }],
    
    // React rules
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}; 