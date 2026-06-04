"use strict";

const {
  addArm64SimToPodfile,
  isArm64SimApplied,
  REQUIRE_MARKER,
  APPLY_MARKER,
} = require("../podfile-snippet");

const EXPO_PODFILE = `require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")
require File.join(File.dirname(\`node --print "require.resolve('react-native/package.json')"\`), "scripts/react_native_pods")

platform :ios, '16.4'

target 'ExampleApp' do
  use_expo_modules!
  config = use_native_modules!
  use_react_native!(:path => config[:reactNativePath])

  post_install do |installer|
    react_native_post_install(installer, config[:reactNativePath])
    # some-other-plugin contribution
    installer.pods_project.targets.each { |t| puts t.name }
  end
end
`;

describe("addArm64SimToPodfile", () => {
  it("injects exactly one require and one apply call", () => {
    const out = addArm64SimToPodfile(EXPO_PODFILE);
    expect((out.match(/rnmlkit-arm64sim:require/g) || []).length).toBe(1);
    expect((out.match(/rnmlkit-arm64sim:apply/g) || []).length).toBe(1);
    expect(isArm64SimApplied(out)).toBe(true);
  });

  it("places the apply call INSIDE the existing post_install block", () => {
    const out = addArm64SimToPodfile(EXPO_PODFILE);
    const postInstallIdx = out.indexOf("post_install do |installer|");
    const applyIdx = out.indexOf(APPLY_MARKER);
    const endIdx = out.lastIndexOf("end");
    expect(postInstallIdx).toBeGreaterThanOrEqual(0);
    expect(applyIdx).toBeGreaterThan(postInstallIdx);
    expect(applyIdx).toBeLessThan(endIdx);
  });

  it("does NOT clobber the existing post_install contents (composition)", () => {
    const out = addArm64SimToPodfile(EXPO_PODFILE);
    expect(out).toContain("react_native_post_install(installer");
    expect(out).toContain("# some-other-plugin contribution");
  });

  it("is idempotent — a second pass changes nothing", () => {
    const once = addArm64SimToPodfile(EXPO_PODFILE);
    const twice = addArm64SimToPodfile(once);
    expect(twice).toBe(once);
  });

  it("appends a top-level post_install when none exists (fallback)", () => {
    const bare = `platform :ios, '16.4'\ntarget 'App' do\n  use_expo_modules!\nend\n`;
    const out = addArm64SimToPodfile(bare);
    expect(out).toContain(REQUIRE_MARKER);
    expect(out).toMatch(/post_install do \|installer\|/);
    expect((out.match(/rnmlkit-arm64sim:apply/g) || []).length).toBe(1);
    // still idempotent on the fallback path
    expect(addArm64SimToPodfile(out)).toBe(out);
  });

  it("resolves the helper from the core package via node require.resolve", () => {
    const out = addArm64SimToPodfile(EXPO_PODFILE);
    expect(out).toContain(
      "require.resolve('@infinitered/react-native-mlkit-core/package.json')"
    );
    expect(out).toContain("'arm64-simulator', 'mlkit_arm64_sim.rb'");
  });
});
