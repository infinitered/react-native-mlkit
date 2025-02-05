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

Use the `useObjectDetectionModels` hook to load your models, and `useObjectDetectionProvider` to get the provider
component.
This will make the models available via React context.

```tsx
/// App.tsx
import {
  ObjectDetectionConfig,
  CustomObjectDetectorOptions,
  useObjectDetectionModels,
  useObjectDetectionProvider,
} from "@infinitered/react-native-mlkit-object-detection";

// Define your custom models if needed (see "Using a Custom Model" for more details)
const MODELS: ObjectDetectionConfig = {
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

// Export this type so we can use it with our hooks later
export type MyModelsConfig = typeof MODELS;

function App() {
// Load the models
  const models = useObjectDetectionModels<MyModelsConfig>({
    assets: MODELS,
    loadDefaultModel: true, // whether to load the default model
    defaultModelOptions: {
      shouldEnableMultipleObjects: true,
      shouldEnableClassification: true,
      detectorMode: "singleImage",
    },
  });

// Get the provider component
  const { ObjectDetectionModelProvider } = useObjectDetectionProvider(models);

  return (
    <ObjectDetectionModelProvider>
      {/* Rest of your app */}
    </ObjectDetectionModelProvider>
  );
}
```

### 2. Use the models in your components

The models are made available through the context system. You can access them in your components using the same hook

```tsx
// MyComponent.tsx
import {
  useObjectDetector,
  ObjectDetectionObject,
} from "@infinitered/react-native-mlkit-object-detection";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import type { MyModelsConfig } from "./App";

type Props = {
  imagePath: string;
};

function MyComponent({ imagePath }: Props) {
// Get the model from context
  const detector = useObjectDetector<MyModelsConfig>("birdDetector");

  const [detectedObjects, setDetectedObjects] = useState<ObjectDetectionObject[]>([]);

  useEffect(() => {
    async function detectObjects(imagePath: string) {
      if (!detector) return;

      try {
        const detectionResults = await detector.detectObjects(imagePath);
        setDetectedObjects(detectionResults);
      } catch (error) {
        console.error("Error detecting objects:", error);
      }
    }

    // Call detectObjects with your image path
    if (imagePath) {
      detectObjects(imagePath);
    }

  }, [detector, imagePath]);

  return (
    <View>
      {detectedObjects.map((detectedObject, index) => (
        <View key={index}>
          {/* Render your detection results */}
          {JSON.stringify(detectedObject)}
        </View>
      ))}
    </View>
  );
}
```

### Model Options

The `ObjectDetectorOptions` and `CustomObjectDetectorOptions` interfaces support the following options:

```ts
interface ObjectDetectorOptions {
  shouldEnableClassification?: boolean; // Enable object classification
  shouldEnableMultipleObjects?: boolean; // Allow detection of multiple objects
  detectorMode?: "singleImage" | "stream"; // Detection mode
}

interface CustomObjectDetectorOptions extends ObjectDetectorOptions {
  classificationConfidenceThreshold?: number; // Minimum confidence for classification
  maxPerObjectLabelCount?: number; // Maximum number of labels per object
}
```

### Detection Results

The `detectObjects` method returns an array of `ObjectDetectionObject` objects. Each object contains the
following properties:

```ts
interface ObjectDetectionObject {
  frame: {
    origin: { x: number; y: number };
    size: { x: number; y: number };
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
