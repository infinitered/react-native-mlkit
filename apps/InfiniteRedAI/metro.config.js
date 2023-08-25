// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config")

/** @type {import("expo/metro-config").MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname)

const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    assetExts: [...defaultConfig.resolver.assetExts, "bin", "tflite"],
  },
}

module.exports = config
