module.exports = function (api) {
  api.cache(true);
  const plugins = [];

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: [
      ...plugins,
      "@babel/plugin-transform-async-generator-functions",
      "react-native-reanimated/plugin",
    ],
  };
};
