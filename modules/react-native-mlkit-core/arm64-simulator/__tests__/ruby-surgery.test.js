"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

// Runs the standalone Ruby spec (surgery_spec.rb) that exercises the pure-Ruby
// parts of the post_install hook: xcconfig/build-setting surgery, idempotency,
// discovery scoping, and the fail-loud layout assertion. Ruby ships with macOS
// and is present in CI; if it is somehow unavailable we skip rather than fail.
const rubyAvailable = spawnSync("ruby", ["--version"]).status === 0;

const maybe = rubyAvailable ? describe : describe.skip;

maybe("Ruby post_install surgery (surgery_spec.rb)", () => {
  it("passes all standalone Ruby checks", () => {
    const spec = path.join(__dirname, "surgery_spec.rb");
    const result = spawnSync("ruby", [spec], { encoding: "utf8" });
    if (result.status !== 0) {
      // Surface the spec output so failures are actionable in CI logs.
      throw new Error(
        `surgery_spec.rb failed (exit ${result.status}):\n${result.stdout}\n${result.stderr}`
      );
    }
    expect(result.stdout).toContain("ALL PASSED");
  });
});

if (!rubyAvailable) {
  // eslint-disable-next-line no-console
  console.warn(
    "[rnmlkit-arm64sim] ruby not found — skipping Ruby surgery tests."
  );
}
