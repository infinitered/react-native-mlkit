import "ts-node/register"
import { ExpoConfig, ConfigContext } from "@expo/config"

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
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []
  return {
    ...config,
    plugins: [...existingPlugins, withSplashScreen, withFlipperDisabled],
  }
}
