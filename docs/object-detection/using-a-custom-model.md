---
sidebar_position: 3
---

# Using a custom model

:::tip
Your custom model needs to be compatible with MLKit. Refer
to [Custom Models with MLKit](https://developers.google.com/ml-kit/custom-models) for general information on
MLKit model compatibility, and specifically the section
on [TensorFlow Lite model compatibility](https://developers.google.com/ml-kit/custom-models#model-compatibility).
:::

## 1. Add your model to the project

Place your model somewhere that makes sense in your project. For example, you might place it in `assets/models/`.

```bash
cp ~/my-custom-model.tflite ./assets/models/my-custom-model.tflite
```

## 2. Configure Metro to bundle TFLite files

Metro usually ignores unknown file types when bundling the app.

Update your metro config so Metro knows to include `.tflite` files in the app bundle.

To do this, create / edit your `./metro.config.js` file:

```ts
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

## 3. Set up the model context provider

Define your models configuration:

```ts
import {
  ObjectDetectionConfig,
  useObjectDetectionModels,
  useObjectDetectionProvider,
} from "react-native-mlkit-object-detection";

const MODELS: ObjectDetectionConfig = {
// the name you'll use to refer to the model
  myCustomModel: {
// the relative path to the model file
    model: require("./assets/models/my-custom-model.tflite"),
    options: {
// the options you want to use for this model
      shouldEnableMultipleObjects: false,
      shouldEnableClassification: false,
      detectorMode: "singleImage",
    },
  },
};

function App() {
// load the models
  const models = useObjectDetectionModels({
    assets: MODELS,
    loadDefaultModel: false,
  });

// fetch the provider
  const { ObjectDetectionModelProvider } = useObjectDetectionProvider(models);

  return (
    <ObjectDetectionModelProvider>
      {/* Rest of your app */ }
    < /ObjectDetectionModelProvider>
  );
}
```

## 4. Use the model to detect objects

```tsx
// MyComponent.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
  useObjectDetector,
  ObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";

type Props = {
  imagePath: string;
};

function MyComponent({ imagePath }: Props) {
// fetch the model from the hook
  const detector = useObjectDetector("myCustomModel");

  const [modelLoaded, setModelLoaded] = useState(detector?.isLoaded() ?? false);

// Models must be loaded before they can be used. This can be slow, and consume
// a lot of resources so consider carefully where and when to load the model
  useEffect(() => {
// Loading models is done asynchronously, so in a useEffect we need to wrap it in an async function
    async function loadModel() {
      if (!detector || modelLoaded) return;
// load the model
      await detector.load();
// set the model loaded state to true
      setModelLoaded(true);
    }

    loadModel();
  }, [detector, modelLoaded]);

// the output of the model is an array of ObjectDetectionObject objects
  const [result, setResult] = useState<ObjectDetectionObject[]>([]);

  useEffect(() => {
// don't try to detect objects if the model isn't loaded
    if (!modelLoaded) return;

// model.detectObjects is async, so when we use it in a useEffect, we need to wrap it in an async function
    async function detectObjects(imagePath: string) {
      const result = await detector.detectObjects(imagePath);
      setResult(result);
    }

    if (imagePath) {
      detectObjects(imagePath);
    }
  }, [detector, modelLoaded, imagePath]);

  return <View>{JSON.stringify(result)}</View>;
}
```
