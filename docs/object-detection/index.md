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
  ObjectDetectionAssetRecord,
  RNMLKitObjectDetectorOptions,
  useObjectDetectionModels,
} from "@infinitered/react-native-mlkit-object-detection";

// Define your custom models if needed (see "Using a Custom Model" for more details)
const MODELS: ObjectDetectionAssetRecord = {
  furnitureDetector: {
    model: require("./assets/models/furniture-detector.tflite"),
  },
  // You can add multiple custom models
  birdDetector: {
    model: require("./assets/models/bird-detector.tflite"),
    // and override the default options
    options: {
      shouldEnableClassification: true,
      shouldEnableMultipleObjects: true,
      detectorMode: "singleImage",
      classificationConfidenceThreshold: 0.5,
      maxPerObjectLabelCount: 3
    }
  },
};

const DEFAULT_MODEL_OPTIONS: RNMLKitObjectDetectorOptions = {
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: true,
  detectorMode: "singleImage",
};

function App() {
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    assets: MODELS,               // Optional: Custom model assets
    loadDefaultModel: true,       // Whether to load the default MLKit model
    defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  });

  return (
    <ObjectDetectionModelContextProvider>
      {/* Rest of your app */}
    </ObjectDetectionModelContextProvider>
  );
}
```

### 2. Use the models in your components

The models are made available through the context system. You can access them in your components using the same hook

```tsx
// MyComponent.tsx
import {
  useObjectDetectionModels,
  RNMLKitObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

function MyComponent() {
  const {
    models: { default: defaultModel },
  } = useObjectDetectionModels({
    assets: MODELS,
    loadDefaultModel: true,
    defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  });

  const [result, setResult] = useState<RNMLKitObjectDetectionObject[]>([]);

  useEffect(() => {
    async function detectObjects(imagePath: string) {
      if (!defaultModel?.isLoaded()) return;

      try {
        const detectionResults = await defaultModel.detectObjects(imagePath);
        setResult(detectionResults);
      } catch (error) {
        console.error("Error detecting objects:", error);
      }
    }

    // Call detectObjects with your image path
    if (imagePath) {
      detectObjects(imagePath);
    }
  }, [defaultModel, imagePath]);

  return (
    <View>
      {result.map((detection, index) => (
        <View key={index}>
          {/* Render your detection results */}
          {JSON.stringify(detection)}
        </View>
      ))}
    </View>
  );
}
```

### Model Options

The `RNMLKitObjectDetectorOptions` interface supports the following options:

```ts
interface RNMLKitObjectDetectorOptions {
  shouldEnableClassification?: boolean;      // Enable object classification
  shouldEnableMultipleObjects?: boolean;     // Allow detection of multiple objects
  detectorMode?: "singleImage" | "stream";   // Detection mode
  classificationConfidenceThreshold?: number; // Minimum confidence for classification
  maxPerObjectLabelCount?: number;           // Maximum number of labels per object
}
```

### Detection Results

The `detectOptions` method returns an array of `RNMLKitObjectDetectionObject` objects. Each object contains the
following properties:

```ts
interface RNMLKitObjectDetectionObject {
  frame: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
  labels: Array<{
    text: string;
    confidence: number;
    index: number;
  }>;
  trackingID?: number;
}
```

:::tip
To use a custom TFLite model for inference, see [Using a Custom Model](./using-a-custom-model).
:::
