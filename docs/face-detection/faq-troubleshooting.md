---
sidebar_position: 600
---

# FAQ / Troubleshooting

## Why does the build fail when I try to build for the iOS simulator?

Google ships the MLKit pods as classic fat `.framework` bundles that have an
`arm64` _device_ slice and an `x86_64` _simulator_ slice, but **no
`arm64`-simulator slice**. CocoaPods compensates by setting
`EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64`, which forces the simulator to
build as `x86_64` and run under Rosetta on Apple Silicon. That Rosetta-translated
simulator is where you'll hit failures such as the `PHPickerViewController`
crash described in
[issue #259](https://github.com/infinitered/react-native-mlkit/issues/259).

The simplest path is still to **run on a physical device**.

### Experimental: native `arm64` simulator (opt-in)

If you need the simulator to build natively on Apple Silicon (no Rosetta), there
is an **experimental, opt-in** flag that retags MLKit's simulator linkage at
`pod install` time. It is **simulator-only and never touches device/Release
builds**, so it is App-Store-safe. Enable it on any MLKit plugin:

```json
["@infinitered/react-native-mlkit-face-detection", { "experimentalArm64Simulator": true }]
```

See the full write-up, bare-React-Native instructions, caveats, and the
App-Store-safety explanation in
[`modules/react-native-mlkit-core/arm64-simulator/README.md`](https://github.com/infinitered/react-native-mlkit/blob/main/modules/react-native-mlkit-core/arm64-simulator/README.md).
This is a stopgap until Google ships MLKit as xcframeworks with a real
`arm64`-simulator slice
([Google issue 178965151](https://issuetracker.google.com/issues/178965151)).

## Why isn't it detecting faces in my photo?

If your app is not detecting faces in a particular photo, but is able to detect faces in a photo, first try another
photo that features
a single face that is directly facing the camera.

If that works, then the issue is likely with the photo you are trying to detect faces in. Here are some common issues
that may
prevent the face detector from detecting faces:

### Minimum Size

Faces need to be a certain minimum size for the algorithm to detect them. This is configurable using the `minFaceSize`
option. (See [Options](../options) for more details.)

That said, there is still a minimum size/resolution required. If you're having trouble, try a higher-resolution photo
and see if that works.

If the model successfully detects a face in the higher res photo, then likely the photo you are trying to detect faces
in is too small.

### Face Obscured or Turned

The face detector is best at detecting faces that are looking directly at the camera. If the face is turned to the side,
or partially obscured, it may not be detected.
