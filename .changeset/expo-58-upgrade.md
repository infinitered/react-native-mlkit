---
"@infinitered/react-native-mlkit-core": major
"@infinitered/react-native-mlkit-document-scanner": major
"@infinitered/react-native-mlkit-face-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-text-recognition": major
---

Upgrade to Expo SDK 58 (React Native 0.88, React 19.3).

BREAKING CHANGE: The modules now target the Expo SDK 58 native toolchain
(`expo-modules-core` ~58). Consuming apps must be on Expo SDK 58. The iOS
deployment target (16.4) is unchanged; Android `compileSdk` is raised from 36 to
37 (required by RN 0.88 and the SDK 58 Expo libraries).

No public JavaScript/TypeScript API changes — this is a native toolchain and
peer-dependency bump.
