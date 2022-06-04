const webpack = require("webpack");
module.exports = function override(config, env) {
  config.resolve.fallback = {
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );
  config.module.rules.push({
    test: /\.mjs$/,
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};
