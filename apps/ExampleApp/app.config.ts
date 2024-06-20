import "ts-node/register"
import { ExpoConfig, ConfigContext } from "@expo/config"

const BUILD_NUMBER = 1

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
const { withSplashScreen } = require("./plugins/withSplashScreen")
const { withFlipperDisabled } = require("./plugins/withFlipperDisabled")
/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => ({
  ...config,
  name: "React Native MLKit",
  slug: "react-native-mlkit",
  owner: "infinitered",
  extra: {
    eas: {
      projectId: "4faa9328-e941-4395-879c-f558bf07e678",
    },
  },
  scheme: "react-native-mlkit",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/app-icon-all.png",
  splash: {
    image: "./assets/images/splash-logo-all.png",
    resizeMode: "contain",
    backgroundColor: "#F4F2F1",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  jsEngine: "hermes",
  assetBundlePatterns: ["**/*"],
  android: {
    icon: "./assets/images/app-icon-android-legacy.png",
    package: "red.infinite.reactnativemlkit.example",
    adaptiveIcon: {
      foregroundImage: "./assets/images/app-icon-android-adaptive-foreground.png",
      backgroundImage: "./assets/images/app-icon-android-adaptive-background.png",
      backgroundColor: "#F4F2F1",
    },
    splash: {
      image: "./assets/images/splash-logo-android-universal.png",
      resizeMode: "contain",
      backgroundColor: "#F4F2F1",
    },
    versionCode: BUILD_NUMBER,
  },
  ios: {
    icon: "./assets/images/app-icon-ios.png",
    supportsTablet: true,
    bundleIdentifier: "red.infinite.reactnativemlkit.example",
    splash: {
      image: "./assets/images/splash-logo-ios-mobile.png",
      tabletImage: "./assets/images/splash-logo-ios-tablet.png",
      resizeMode: "contain",
      backgroundColor: "#F4F2F1",
    },
    buildNumber: String(BUILD_NUMBER),
  },
  web: {
    favicon: "./assets/images/app-icon-web-favicon.png",
    splash: {
      image: "./assets/images/splash-logo-web.png",
      resizeMode: "contain",
      backgroundColor: "#F4F2F1",
    },
    bundler: "metro",
  },
  plugins: [
    "expo-localization",
    [
      "expo-build-properties",
      {
        ios: {
          newArchEnabled: false,
          flipper: false,
          deploymentTarget: "13.4",
        },
        android: {
          newArchEnabled: false,
          compileSdkVersion: 34,
        },
      },
    ],
    "expo-font",
    withSplashScreen,
    withFlipperDisabled,
  ],
  experiments: {
    tsconfigPaths: true,
  },
})
