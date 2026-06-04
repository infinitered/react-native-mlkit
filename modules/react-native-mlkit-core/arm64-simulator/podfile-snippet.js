// @ts-check
"use strict";

/**
 * Pure, dependency-free Podfile string surgery for the experimental arm64
 * iOS-Simulator feature. Kept separate from the Expo plugin wrapper so it can
 * be unit-tested without `@expo/config-plugins` installed.
 *
 * The transform is deliberately minimal: it injects (1) a single `require` of
 * the pinned Ruby helper shipped in this package, and (2) a single call to
 * `RNMLKitArm64Sim.apply!(installer, enabled: true)` INSIDE the consumer's
 * existing `post_install do |installer|` block (Expo prebuild always generates
 * one). It never defines a second `post_install` (which would clobber React
 * Native's), and every insertion is guarded by a marker so re-running
 * `expo prebuild` / `pod install` is idempotent and composes with other
 * plugins' post_install contributions.
 */

const REQUIRE_MARKER = "# rnmlkit-arm64sim:require (experimental, managed by @infinitered/react-native-mlkit-core)";
const APPLY_MARKER = "# rnmlkit-arm64sim:apply (experimental, managed by @infinitered/react-native-mlkit-core)";

// Resolve the helper the same way React Native / Expo Podfiles resolve their
// own helper scripts: via `node --print require.resolve(...)`. This works
// regardless of hoisting / monorepo layout on the build machine.
const REQUIRE_LINE =
  "require File.join(File.dirname(`node --print \"require.resolve('@infinitered/react-native-mlkit-core/package.json')\"`), 'arm64-simulator', 'mlkit_arm64_sim.rb') " +
  REQUIRE_MARKER;

const APPLY_LINE = "    RNMLKitArm64Sim.apply!(installer, enabled: true) " + APPLY_MARKER;

/**
 * Returns the Podfile contents with the arm64-simulator hook wired in.
 * Idempotent: calling it on already-modified contents returns them unchanged.
 *
 * @param {string} contents raw Podfile text
 * @returns {string}
 */
function addArm64SimToPodfile(contents) {
  let out = contents;

  // 1) Ensure the `require` line is present (once), near the top of the file
  //    so the constant is defined before post_install runs.
  if (!out.includes(REQUIRE_MARKER)) {
    out = REQUIRE_LINE + "\n" + out;
  }

  // 2) Ensure the apply call is present (once) inside an existing post_install.
  if (!out.includes(APPLY_MARKER)) {
    const postInstall = /(^[ \t]*post_install do \|[A-Za-z_][A-Za-z0-9_]*\|[ \t]*\n)/m;
    if (postInstall.test(out)) {
      out = out.replace(postInstall, (match) => match + APPLY_LINE + "\n");
    } else {
      // No existing post_install (unusual for Expo): append a top-level one.
      out =
        out.replace(/\s*$/, "\n") +
        "\npost_install do |installer|\n" +
        APPLY_LINE +
        "\nend\n";
    }
  }

  return out;
}

/**
 * True when the Podfile already has the hook wired in (both markers present).
 * @param {string} contents
 * @returns {boolean}
 */
function isArm64SimApplied(contents) {
  return contents.includes(REQUIRE_MARKER) && contents.includes(APPLY_MARKER);
}

module.exports = {
  addArm64SimToPodfile,
  isArm64SimApplied,
  REQUIRE_MARKER,
  APPLY_MARKER,
  REQUIRE_LINE,
  APPLY_LINE,
};
