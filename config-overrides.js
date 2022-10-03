const webpack = require("webpack");
const path = require('path');

module.exports = {
  webpack: function (config, env) {
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
  },
  paths: function (paths, env) {
    // reading the build path from the selected .env file
    const buildPath = process.env.REACT_APP_BUILD_PATH
    // defining "build" as a fallback path
    paths.appBuild = path.resolve(__dirname, buildPath ? buildPath : "build");

    return paths;
  }
}

