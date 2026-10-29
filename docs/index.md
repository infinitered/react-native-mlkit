---
sidebar_position: 1
---

# React Native MLKit

<p align="center">
  <img src="https://raw.githubusercontent.com/infinitered/react-native-mlkit/main/_art/ir_mlkit_logo.png" alt="IR MLKit Logo" width="400" />
  <h2 align="center">RN MLKit Wrapper for Expo</h2>
</p>

# Introduction

`react-native-mlkit` is an native module for Expo and React Native that lets you use
the [MLKit](https://developers.google.com/ml-kit) library in your Expo app.

## Available Modules

Currently the following modules are available:

- [Face Detection](./face-detection)
- [Object Detection](./object-detection)
- [Image Labeling](./image-labeling)
- [Document Scanner](./document-scanner)

We will be adding more modules in the future, and especially welcome PRs that add support for new MLKit libraries! Check
out the contributing guide for more information on how to contribute.

## Installation

Each module is published as a separate npm package. For specific installation instructions for a particular module check
the following pages:

- [Face Detection](./face-detection)
- [Object Detection](./object-detection)
- [Image Labeling](./image-labeling)
- [Document Scanner](./document-scanner)
- [Text Recognition](./text-recognition/)

## Compatibility

Each major version of RN MLKit targets a specific Expo SDK. Install the version that matches your app's Expo SDK:

| Expo SDK | RN MLKit |
| -------- | -------- |
| ^49.0.0  | &lt;= 0.7.7 |
| ^50.0.0  | ^1.0.0   |
| ^51.0.0  | ^2.0.0   |
| ^52.0.0  | ^3.0.0   |
| ^53.0.0  | ^4.0.0   |
| ^54.0.0  | ^5.0.0   |
| ^56.0.0  | ^6.0.0   |
| ^58.0.0  | ^7.0.0   |

The current release (`^7.0.0`) requires Expo SDK 58 (React Native 0.88). On iOS the minimum deployment target is
16.4; on Android, `minSdkVersion` is 24 and `compileSdkVersion` is 37.

## FAQ

### Why is each module a separate package?

Because the bundled TFLite modules are quite large, and we want to give you the option to only include the modules you
need.
Logic and classes shared by all the types have been extracted into `react-native-mlkit-core`, to reduce code
duplication.

### Is RN MLKit compatible with all platforms?

While we aim to support all platforms, we currently only support iOS and Android. The native modules do not work on the
web, and we do not have plans to support the web at this time.

---
