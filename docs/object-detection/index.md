---
sidebar_position: 1
title: Getting Started
---

# Object Detection

## Getting Started

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

## Basic Usage

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
  const model = useObjectDetector();

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

:::tip
To use a custom TFLite model for inference, see [Using a Custom Model](./using-a-custom-model).
