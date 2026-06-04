"use strict";

// Mock @expo/config-plugins so the plugin can be unit-tested without the
// dependency installed, and so we can observe whether withDangerousMod runs.
let dangerousModCalls;
jest.mock(
  "@expo/config-plugins",
  () => ({
    // createRunOncePlugin just returns the plugin in our mock (no dedupe state).
    createRunOncePlugin: (plugin) => plugin,
    withDangerousMod: (config, [platform, action]) => {
      dangerousModCalls.push({ platform, action });
      return { ...config, __dangerousModApplied: true };
    },
    WarningAggregator: { addWarningIOS: jest.fn() },
  }),
  { virtual: true }
);

const plugin = require("../withArm64Simulator");

beforeEach(() => {
  dangerousModCalls = [];
});

describe("withArm64Simulator (default-off requirement)", () => {
  const baseConfig = { name: "App", slug: "app" };

  it("injects NOTHING and returns the config unchanged when the prop is absent", () => {
    const result = plugin(baseConfig);
    expect(result).toBe(baseConfig);
    expect(dangerousModCalls).toHaveLength(0);
  });

  it("injects nothing when the prop is explicitly false", () => {
    const result = plugin(baseConfig, { experimentalArm64Simulator: false });
    expect(result).toBe(baseConfig);
    expect(dangerousModCalls).toHaveLength(0);
  });

  it("schedules a Podfile dangerous mod when experimentalArm64Simulator is true", () => {
    const result = plugin(baseConfig, { experimentalArm64Simulator: true });
    expect(dangerousModCalls).toHaveLength(1);
    expect(dangerousModCalls[0].platform).toBe("ios");
    expect(result.__dangerousModApplied).toBe(true);
  });

  it("also accepts the arm64Simulator shorthand", () => {
    plugin(baseConfig, { arm64Simulator: true });
    expect(dangerousModCalls).toHaveLength(1);
  });
});

describe("withArm64Simulator dangerous mod", () => {
  it("rewrites the Podfile on disk via the mod action", () => {
    const fs = require("fs");
    const os = require("os");
    const path = require("path");

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rnmlkit-plugin-"));
    const podfile = path.join(dir, "Podfile");
    fs.writeFileSync(
      podfile,
      "platform :ios, '16.4'\npost_install do |installer|\nend\n"
    );

    plugin({ name: "App" }, { experimentalArm64Simulator: true });
    const action = dangerousModCalls[0].action;
    action({ modRequest: { platformProjectRoot: dir } });

    const contents = fs.readFileSync(podfile, "utf8");
    expect(contents).toContain("rnmlkit-arm64sim:require");
    expect(contents).toContain("RNMLKitArm64Sim.apply!(installer, enabled: true)");
  });
});
