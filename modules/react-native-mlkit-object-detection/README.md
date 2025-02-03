# RNMLKit Object Detection

## Table of Contents

<!-- TOC -->

- [RNMLKit Object Detection](#reactnativemlkit-object-detection)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Installation](#installation)
  - [Basic Usage with Default Model](#basic-usage-with-default-model)
    - [1. Set up the model context provider](#1-set-up-the-model-context-provider)
    - [2. Fetch the model using the `useObjectDetectionModel` hook, and use it to detect objects in an image](#2-fetch-the-model-using-the-useobjectdetectionmodel-hook-and-use-it-to-detect-objects-in-an-image)
  - [Using a custom model](#using-a-custom-model)
  _ [Compatible Models](#compatible-models)
  _ [1. Add your model to the project, and Configure Metro to bundle your model](#1-add-your-model-to-the-project-and-configure-metro-to-bundle-your-model)
  _ [2. Set up the model context provider](#2-set-up-the-model-context-provider)
  _ [3. Fetch the model using the `useObjectDetectionModel` hook, and use it to detect objects in an image](#3-fetch-the-model-using-the-useobjectdetectionmodel-hook-and-use-it-to-detect-objects-in-an-image)
  <!-- TOC -->

---

## Overview

This is an expo module that lets you use
the [MLKit Object Detection](https://developers.google.com/ml-kit/vision/object-detection) library in your Expo app.

## Installation

Install like any other npm package:

```bash
#yarn
yarn add @infinitered/react-native-mlkit-object-detection

#npm
npm install @infinitered/react-native-mlkit-object-detection
```

## Basic Usage with Default Model

### 1. Set up the model context provider

Use the `useObjectDetectionModels` hook to fetch an `ObjectDetectionModelContextProvider`. This will make the models
available via React context.

```tsx
// App.tsx

import {
  AssetRecord,
  useObjectDetectionModels,
} from "@infinitered/react-native-mlkit-object-detection";

// For descriptions of options for default models see link below this snipped.
function App() {
  // fetch the provider component from the hook
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    loadDefaultModel: true,
    defaultModelOptions: {
      shouldEnableMultipleObjects: true,
      shouldEnableClassification: true,
      detectorMode: "singleImage",
    },
  });

  return (
    <ObjectDetectionModelContextProvider>
      {/* Rest of your app */}
    </ObjectDetectionModelContextProvider>
  );
}
```

### 2. Fetch the model using the `useObjectDetectionModel` hook, and use it to detect objects in an image

Models can be quite large, take a while to load and can consume a lot of memory. You should consider where in your
app's lifecycle you load the model.

```tsx
// MyComponent.tsx

import {
  useObjectDetector,
  RNMLKitObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";
import { useEffect } from "react";

function MyComponent() {
  // fetch the model from the hook, if you don't pass a model name it will fetch the default MLKit Object Detection model
  const { model } = useObjectDetector();

  const [modelLoaded, setModelLoaded] = useState(model?.isLoaded() ?? false);

  // Models must be loaded before they can be used. This can be slow, and consume
  // a lot of resources so consider carefully where and when to load the model
  useEffect(() => {
    // Loading models is done asynchronously, so in a useEffect we need to wrap it in an async function
    async function loadModel() {
      if (!model || modelLoaded) return;
      // load the model
      await model.load();
      // set the model loaded state to true
      setModelLoaded(true);
    }

    loadModel();
  }, [model, modelLoaded]);

  // the output of the model is an array of `RNMLKitObjectDetectionObject` objects
  const [result, setResult] = useState<RNMLKitObjectDetectionObject[]>([]);

  useEffect(() => {
    if (!modelLoaded) return;

    // model.detectObjects is async, so when we use it in a useEffect, we need to wrap it in an async function
    async function detectObjects(image: AssetRecord) {
      const result = await model.detectObjects(image);
      setResult(result);
    }

    detectObjects();
  }, [model, modelLoaded]);

  return <View>{JSON.stringify(result)}</View>;
}
```

## Using a custom model

### Compatible Models

Your custom model needs to be compatible with MLKit. Refer
to [Custom Models with MLKit](https://developers.google.com/ml-kit/custom-models) for general information on
MLKit model compatibility,
and specifically the section
on [TensorFlow Lite model compatibility](https://developers.google.com/ml-kit/custom-models#model-compatibility).

### 1. Add your model to the project, and Configure Metro to bundle your model

Place your model somewhere that makes sense in your project. For example, you might place it in `assets/models/`.

```bash
cp ~/my-custom-model.tflite ./assets/models/my-custom-model.tflite
```

Then update your metro config so Metro knows to bundle TFLite files. You do this in your `./metro.config.js` file.

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

### 2. Set up the model context provider

First define an AssetRecord object with the details of your model, and your desired options.

```js
// App.tsx

import {
  AssetRecord,
  useObjectDetectionModels,
} from "@infinitered/react-native-mlkit-object-detection";

const MODELS: AssetRecord = {
  // the name you'll use to refer to the model
  myCustomModel: {
    // the relative path to the model file
    asset: require("./assets/models/my-custom-model.tflite"),
    options: {
      // the options you want to use for this model
      shouldEnableMultipleObjects: false,
      shouldEnableClassification: false,
      detectorMode: "singleImage",
    },
  },
};

// For descriptions of options for default models see link below this snipped.
function App() {
  // fetch the provider component from the hook
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    models: MODELS,
    loadDefaultModel: false,
  });

  return (
    <ObjectDetectionModelContextProvider>
      // Rest of your app
    </ObjectDetectionModelContextProvider>
  );
}
```

### 3. Fetch the model using the `useObjectDetectionModel` hook, and use it to detect objects in an image

```tsx
// MyComponent.tsx

import {
  useObjectDetector,
  RNMLKitObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";
import { useEffect } from "react";

function MyComponent() {
  // fetch the model from the hook, if you don't pass a model name it will fetch the default MLKit Object Detection model
  const { model } = useObjectDetector("myCustomModel");

  const [modelLoaded, setModelLoaded] = useState(model?.isLoaded() ?? false);

  // Models must be loaded before they can be used. This can be slow, and consume
  // a lot of resources so consider carefully where and when to load the model
  useEffect(() => {
    // Loading models is done asynchronously, so in a useEffect we need to wrap it in an async function
    async function loadModel() {
      if (!model || modelLoaded) return;
      // load the model
      await model.load();
      // set the model loaded state to true
      setModelLoaded(true);
    }

    loadModel();
  }, [model, modelLoaded]);

  // the output of the model is an array of `RNMLKitObjectDetectionObject` objects
  const [result, setResult] = useState<RNMLKitObjectDetectionObject[]>([]);

  useEffect(() => {
    if (!modelLoaded) return;

    // model.detectObjects is async, so when we use it in a useEffect, we need to wrap it in an async function
    async function detectObjects(image: AssetRecord) {
      const result = await model.detectObjects(image);
      setResult(result);
    }

    detectObjects();
  }, [model, modelLoaded]);

  return <View>{JSON.stringify(result)}</View>;
}
```
