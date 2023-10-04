---
sidebar_position: 99
---

# Using a Custom Model

MLKit includes a general-purpose image labeling model that recognizes more than 400 entities that
cover the most commonly-found concepts in photos.

However, you may want to use your own custom model. For instance the demo app uses the NSFWJS model to detect
inappropriate content in photos.

This guide will show you how to use your own custom model with MLKit.

## Compatible Models

Your custom model needs to be compatible with MLKit.

Refer to [Custom Models with MLKit](https://developers.google.com/ml-kit/custom-models) for general information on
MLKit model compatibility, and specifically the section
on [TensorFlow Lite model compatibility](https://developers.google.com/ml-kit/custom-models#model-compatibility).

## 1. Add your model to the project

Place your model somewhere that makes sense in your project. For example, you might place it in `assets/models/`.

```bash
cp ~/my-custom-model.tflite ./assets/models/my-custom-model.tflite
```

## 2. Configure Metro to bundle your model

Update your metro config so Metro knows to bundle TFLite files. You do this in your `./metro.config.js` file.

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.tflite` files for TFLite models
  "tflite"
);

module.exports = config;
```

See the [Expo Docs](https://docs.expo.dev/guides/customizing-metro/#adding-more-file-extensions-to-assetexts) for
detailed instructions on [customizing metro](https://docs.expo.dev/guides/customizing-metro).

