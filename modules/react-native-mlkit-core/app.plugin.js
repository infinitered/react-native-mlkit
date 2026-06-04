"use strict";

// Expo auto-detects `app.plugin.js` at a package root. The experimental
// arm64 iOS-Simulator config plugin lives here so every MLKit feature package
// can re-export it. See ./arm64-simulator/withArm64Simulator.js.
module.exports = require("./arm64-simulator/withArm64Simulator");
