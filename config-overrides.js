/* eslint-disable @typescript-eslint/no-var-requires */
const { override, addBabelPlugin } = require("customize-cra");
const webpack = require("webpack");

override(addBabelPlugin("styled-jsx/babel"));

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
