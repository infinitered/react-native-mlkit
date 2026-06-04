// @ts-check
"use strict";

/**
 * Expo config plugin: experimental, opt-in arm64 iOS-Simulator support for the
 * MLKit-backed packages. See ../README.md and ./PHASE-0-FINDINGS.md.
 *
 * Usage (Expo app config):
 *
 *   ["@infinitered/react-native-mlkit-face-detection", { "experimentalArm64Simulator": true }]
 *
 * When the prop is falsy/absent the plugin injects NOTHING — the default
 * Rosetta/x86_64 simulator path is preserved byte-for-byte. When truthy it
 * appends a `require` + `RNMLKitArm64Sim.apply!` into the generated Podfile's
 * existing `post_install` block (never clobbering it).
 */

const {
  withDangerousMod,
  createRunOncePlugin,
  WarningAggregator,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const { addArm64SimToPodfile } = require("./podfile-snippet");

const pkg = require("../package.json");

/**
 * @typedef {Object} Arm64SimulatorProps
 * @property {boolean} [experimentalArm64Simulator] turn the feature on
 * @property {boolean} [arm64Simulator] alias accepted for the brief's shorthand
 */

/**
 * @param {import('@expo/config-plugins').ExportedConfig} config
 * @param {Arm64SimulatorProps} [props]
 */
function withArm64Simulator(config, props = {}) {
  const enabled =
    props.experimentalArm64Simulator === true || props.arm64Simulator === true;

  // Hard requirement: with the flag off/absent, inject nothing.
  if (!enabled) {
    return config;
  }

  WarningAggregator.addWarningIOS(
    "react-native-mlkit",
    "experimentalArm64Simulator is ON — this retags MLKit's simulator linkage " +
      "so the iOS simulator can build natively on Apple Silicon. It is " +
      "EXPERIMENTAL and SIMULATOR-ONLY; device/Release builds are untouched. " +
      "A future MLKit version may break it (the install will then fail loudly)."
  );

  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const contents = fs.readFileSync(podfilePath, "utf8");
      const next = addArm64SimToPodfile(contents);
      if (next !== contents) {
        fs.writeFileSync(podfilePath, next, "utf8");
      }
      return config;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withArm64Simulator,
  // Run-once key shared across every MLKit package that re-exports this plugin,
  // so enabling it on several packages still injects exactly once.
  "react-native-mlkit-arm64-simulator",
  pkg.version
);

// Exposed for tests / advanced consumers.
module.exports.withArm64Simulator = withArm64Simulator;
