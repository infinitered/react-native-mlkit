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
deployment target (16.4) and Android `compileSdk` (36) are unchanged.

No public JavaScript/TypeScript API changes — this is a native toolchain and
peer-dependency bump.
