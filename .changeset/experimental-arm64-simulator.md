---
"@infinitered/react-native-mlkit-core": minor
"@infinitered/react-native-mlkit-face-detection": minor
"@infinitered/react-native-mlkit-text-recognition": minor
"@infinitered/react-native-mlkit-image-labeling": minor
"@infinitered/react-native-mlkit-object-detection": minor
---

Add experimental, opt-in **native arm64 iOS Simulator** support (#259).

Google ships the MLKit pods as fat `.framework` bundles with no
`arm64`-simulator slice, which forces `EXCLUDED_ARCHS[sdk=iphonesimulator*] =
arm64` and pushes the Apple-Silicon simulator into Rosetta (breaking
`PHPickerViewController`). This release adds an opt-in CocoaPods `post_install`
hook that retags MLKit's _simulator_ linkage at install time so the simulator
builds natively on Apple Silicon — no Rosetta.

- Enable via the Expo config plugin prop
  `["@infinitered/react-native-mlkit-face-detection", { "experimentalArm64Simulator": true }]`,
  or in bare React Native via `RN_MLKIT_ARM64_SIM=1` and the shipped Ruby helper.
- **Off by default.** With the flag absent, `pod install` is unchanged.
- **Simulator-only and App-Store-safe:** device/Release/Archive builds are never
  modified, re-signed, or rewired; no Google binary is redistributed or
  committed. It operates only on the copies CocoaPods already downloaded.
- Idempotent, and **fails loudly** if a future MLKit layout no longer matches.

This is a stopgap until Google ships MLKit as xcframeworks with a real
`arm64`-simulator slice
([Google issue 178965151](https://issuetracker.google.com/issues/178965151)).
See `modules/react-native-mlkit-core/arm64-simulator/README.md`.
