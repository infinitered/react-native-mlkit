# @infinitered/react-native-mlkit-text-recognition

## 6.0.0

### Major Changes

- 5ebcba6: Upgrade to Expo SDK 56 (React Native 0.85, React 19.2).

  BREAKING CHANGE: The minimum iOS deployment target is raised from 15.1 to
  16.4, and the modules now target the Expo SDK 56 native toolchain
  (`expo-modules-core` ~56, Android `compileSdk` 36 / Kotlin 2.x). Consuming
  apps must be on Expo SDK 56 and build with Xcode 26.4 for iOS.

  No public JavaScript/TypeScript API changes — this is a native toolchain and
  peer-dependency bump.

### Patch Changes

- 50f9384: fixed wrong dependency for ci with text recognition
- Updated dependencies [5ebcba6]
- Updated dependencies [6f0d469]
  - @infinitered/react-native-mlkit-core@6.0.0

## 5.0.1

### Patch Changes

- b842bfd: Version bump

## 1.1.0

### Minor Changes

- 21f3109: Added first version of Text Recognition module
