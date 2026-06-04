# Experimental: native arm64 iOS Simulator support

> **Status: experimental, opt-in, off by default.** Nothing in this directory
> runs unless you explicitly enable it. With it disabled, `pod install`
> produces exactly today's output.

## The problem ([#259](https://github.com/infinitered/react-native-mlkit/issues/259))

Google ships the MLKit CocoaPods (`MLKitCommon`, `MLImage`, `MLKitVision`,
`MLKitFaceDetection`, …) as classic **fat `.framework` bundles** that contain an
`ios-arm64` *device* slice and an `x86_64` *simulator* slice, but **no
`arm64` simulator slice**. To cope, CocoaPods injects

```
EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64
```

into your app's xcconfig, which forces the iOS Simulator to build as `x86_64`
and run under **Rosetta** on Apple Silicon. In that Rosetta-translated
simulator, `PHPickerViewController` (the system image picker) crashes
reproducibly — the symptom reported in #259.

The correct long-term fix is for Google to ship `.xcframework`s with a real
`ios-arm64-simulator` slice (Google issue
[178965151](https://issuetracker.google.com/issues/178965151)). **This flag is a
stopgap until then.**

## What this feature does

When enabled, a CocoaPods `post_install` hook (shipped in this package, written
in Ruby, using only the standard Xcode command-line tools `lipo`, `vtool`,
`otool`, `codesign`):

1. **Discovers** the MLKit/Google fat frameworks under `Pods/` that lack an
   arm64-simulator slice.
2. For each, takes the **device `arm64`** slice, retags its Mach-O build-version
   load command from iOS (platform 2) to **iOS-Simulator (platform 7)**, and
   `lipo`-combines it with the original `x86_64` simulator slice into a
   **universal simulator binary** (`arm64` + `x86_64`).
3. Writes a **simulator-only copy** of the framework to a git-ignored dir
   (`Pods/.rnmlkit-arm64sim/`), then points
   `FRAMEWORK_SEARCH_PATHS[sdk=iphonesimulator*]` at it and removes `arm64` from
   `EXCLUDED_ARCHS[sdk=iphonesimulator*]`.

The result: the simulator links a real `arm64` slice and builds natively on
Apple Silicon — no Rosetta, working `PHPickerViewController`.

## 🔒 Why this is App-Store-safe

**We only ever transform the *simulator* linkage.** The override in step 3 is
scoped with `[sdk=iphonesimulator*]`, so **device / Release / Archive builds
never see it** — they keep linking the pristine, untouched, Google-signed
`.framework`. We do not redistribute, vendor, commit, re-sign, or upload any
Google binary, and we never modify the device slice. Therefore:

- App Store / TestFlight builds cannot be broken or rejected by this feature.
- The Info.plist / beta-version-string rejection problems that plague
  *redistributed* MLKit xcframeworks do not apply here — we never alter what
  goes into a release build.

All transformation happens at build time against the copies CocoaPods already
downloaded into *your* `Pods/`. Conceptually this is "patch-package for pods."

## Enabling it — Expo (config plugin)

Add the prop to **any one** of the MLKit packages in your app config
(`app.json` / `app.config.js`):

```json
{
  "expo": {
    "plugins": [
      ["@infinitered/react-native-mlkit-face-detection", { "experimentalArm64Simulator": true }]
    ]
  }
}
```

Then rebuild native:

```bash
npx expo prebuild --clean
cd ios && pod install
```

The prop is also accepted under the shorthand `arm64Simulator`. With the prop
absent or `false`, the plugin injects **nothing**.

## Enabling it — bare React Native

Add two lines to your `ios/Podfile` and gate them on an env var:

```ruby
# near the top of the Podfile:
require File.join(
  File.dirname(`node --print "require.resolve('@infinitered/react-native-mlkit-core/package.json')"`),
  'arm64-simulator', 'mlkit_arm64_sim.rb'
)

# inside your existing post_install block:
post_install do |installer|
  # ...your other post_install logic / react_native_post_install(...)...
  RNMLKitArm64Sim.apply!(installer) # reads RN_MLKIT_ARM64_SIM
end
```

Then install with the env var set:

```bash
RN_MLKIT_ARM64_SIM=1 pod install
# add RN_MLKIT_ARM64_SIM_VERBOSE=1 for per-command logging
```

Without `RN_MLKIT_ARM64_SIM=1`, `apply!` is a hard no-op.

## Caveats

- **Experimental.** The prop name says so on purpose. It performs binary
  surgery on third-party frameworks at install time.
- **A future MLKit version may break it.** If Google changes the framework
  layout or slices, the hook **fails loudly** during `pod install` (naming the
  framework and the detected MLKit version) rather than silently producing a
  broken simulator build. If that happens, either pin the previous MLKit
  version or disable the flag until the script is updated. (If Google starts
  shipping xcframeworks with an arm64-sim slice, the hook detects that and
  becomes a no-op — you can then remove the flag entirely.)
- **Idempotent.** Re-running `pod install` skips already-converted frameworks.
- **Simulator only.** Device builds are unaffected (see safety section).
- **Disk.** Converted simulator copies live under `Pods/.rnmlkit-arm64sim/`
  (git-ignored along with the rest of `Pods/`).

## On-Mac verification runbook

This feature's binary transform requires the Xcode toolchain and cannot be
exercised on Linux/CI without a Mac. To verify on an Apple-Silicon Mac:

**Phase 1 — the transform (single framework):**

```bash
# after a normal `pod install` in a test app:
cd ios
FW=$(ls -d Pods/MLImage/**/MLImage.framework 2>/dev/null | head -1)
ruby node_modules/@infinitered/react-native-mlkit-core/arm64-simulator/transmogrify.rb --verbose "$FW"

OUT=Pods/MLImage/.rnmlkit-arm64sim/MLImage.framework/MLImage   # adjust path
lipo -info "$OUT"            # expect: arm64 x86_64
otool -l -arch arm64 "$OUT" | grep -A3 LC_BUILD_VERSION   # expect platform 7 (IOSSIMULATOR)

# idempotency: a second run is a no-op
ruby node_modules/@infinitered/react-native-mlkit-core/arm64-simulator/transmogrify.rb --verbose "$FW"   # prints "skipping (idempotent)"
```

**Phase 2/3/4 — full install + build:**

```bash
# Expo:
npx expo prebuild --clean
cd ios && pod install        # banner prints; verify EXCLUDED_ARCHS arm64 is gone:
grep -R "EXCLUDED_ARCHS" Pods/Target\ Support\ Files/Pods-*/*.xcconfig

# build & run the simulator natively (no Rosetta):
cd .. && npx expo run:ios --device "iPhone 16 Pro"
# then: open the image picker (PHPickerViewController) and pick a photo,
# run face detection on it — both must work in the simulator.
```

**Device/Release untouched:**

```bash
# confirm the device build still excludes arm64-sim exactly as baseline and the
# pristine framework is what an archive links:
xcodebuild -workspace ios/App.xcworkspace -scheme App -sdk iphoneos -configuration Release -showBuildSettings | grep EXCLUDED_ARCHS
```

> Reviewers who prefer a full `.xcframework` over the sdk-scoped
> search-path splice can build one equivalently with
> `xcodebuild -create-xcframework -framework <device.framework> -framework <sim.framework> -output X.xcframework`;
> see `PHASE-0-FINDINGS.md` §4 for why the splice form was chosen for automatic
> integration.

## Files in this directory

| File | Purpose |
| --- | --- |
| `transmogrify.rb` | Phase 1 — the pinned per-framework transform (CLI + library). |
| `mlkit_arm64_sim.rb` | Phase 2 — shared `post_install` logic (`RNMLKitArm64Sim.apply!`). |
| `withArm64Simulator.js` | Phase 3 — the Expo config plugin (`withDangerousMod`). |
| `podfile-snippet.js` | Phase 3 — dependency-free Podfile string surgery (testable). |
| `PHASE-0-FINDINGS.md` | Design rationale, slice strategy, safety analysis. |
