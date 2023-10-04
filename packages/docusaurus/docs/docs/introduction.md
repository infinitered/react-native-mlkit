---
sidebar_position: 1
---

# Introduction

`react-native-mlkit` is an native module for Expo and React Native that lets you use
the [MLKit](https://developers.google.com/ml-kit) library in your Expo app.

## Available Modules

Currently the following modules are available:

- [Face Detection](../face-detection)
- [Object Detection](../object-detection)
- [Image Labeling](../image-labeling)

We will be adding more modules in the future, and especially welcome PRs that add support for new MLKit libraries! Check
out the contributing guide for more information on how to contribute.

## Installation

Each module is published as a separate npm package. For specific installation instructions for a particular module check
the followig pages:

- [Face Detection](../face-detection)
- [Object Detection](../object-detection)
- [Image Labeling](../image-labeling)

## FAQ

### Why is each module a separate package?

Because the bundled TFLite modules are quite large, and we want to give you the option to only include the modules you
need.
Logic and classes shared by all the types have been extracted into `react-native-mlkit-core`, to reduce code
duplication.

---
