---
"@infinitered/react-native-mlkit-core": major
"@infinitered/react-native-mlkit-document-scanner": major
"@infinitered/react-native-mlkit-face-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-text-recognition": major
---

Upgrade to Expo SDK 56 (React Native 0.85, React 19.2).

BREAKING CHANGE: The minimum iOS deployment target is raised from 15.1 to
16.4, and the modules now target the Expo SDK 56 native toolchain
(`expo-modules-core` ~56, Android `compileSdk` 36 / Kotlin 2.x). Consuming
apps must be on Expo SDK 56 and build with Xcode 26.4 for iOS.

No public JavaScript/TypeScript API changes — this is a native toolchain and
peer-dependency bump.
