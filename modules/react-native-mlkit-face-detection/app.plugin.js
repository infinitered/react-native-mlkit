"use strict";

// Re-export the experimental arm64 iOS-Simulator config plugin from
// @infinitered/react-native-mlkit-core (a dependency of this package), so it
// can be enabled directly on this package, e.g.:
//
//   ["@infinitered/react-native-mlkit-<feature>", { "experimentalArm64Simulator": true }]
//
// The plugin is a no-op unless the prop is set. See the core package for docs.
module.exports = require("@infinitered/react-native-mlkit-core/app.plugin");
