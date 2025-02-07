---
sidebar_position: 1
title: Getting Started
---

# Getting Started with react-native-mlkit-image-labeling

## Overview

`react-native-mlkit-image-labeling` provides utilities for image classification using ML Kit in React Native apps. It
allows for the classification of images using either ML Kit's built-in models or custom TensorFlow Lite models.

## Installation

```shell
npm install @infinitered/react-native-mlkit-image-labeling expo-asset
```

## Usage

### 1. Import necessary hooks and types:

```tsx
import {
  useImageLabeling,
  useImageLabelingProvider,
  useImageLabelingModels,
  ImageLabelingConfig,
  ClassificationResult
} from "@infinitered/react-native-mlkit-image-labeling";
```

### 2. Define your models configuration:

Create an `ImageLabelingConfig` object that identifies your model files and options:

```tsx
const MODELS: ImageLabelingConfig = {
  nsfw: {
    model: require("./path/to/model.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0.5,
    },
  },
};
```

### 3. Set up the Provider:

The image labeling functionality requires a provider at the root of your app or where you plan to use the models:

```tsx
function App() {
  const models = useImageLabelingModels(MODELS);
  const { ImageLabelingModelProvider } = useImageLabelingProvider(models);

  return (
    <ImageLabelingModelProvider>
      <YourApp />
    </ImageLabelingModelProvider>
  );
}

```

### 4. Using the image labeler in your components:

```tsx
function ImageClassifier() {
// Get the classifier instance for your model
  const classifier = useImageLabeling("nsfw");

  const classifyImage = async (imageUri: string) => {
    try {
      const result = await classifier.classifyImage(imageUri);
      console.log(result);
    } catch (error) {
      console.error("Classification failed:", error);
    }
  };

  return (
    <View>
      // ....your component
    </View>
  );
}

```

## Core Components & Hooks

### useImageLabelingModels

Loads and initializes the models from their asset files.

```tsx
const models = useImageLabelingModels(MODELS);
```

### useImageLabelingProvider

Creates a provider component that manages the image labeling models context.

```tsx
const { ImageLabelingModelProvider } = useImageLabelingProvider(models);
```

### useImageLabeling

Returns a classifier instance for a specific model.

```tsx
const classifier = useImageLabeling("modelName");
```

### RNMLKitClassifier Methods

The classifier instance provides these methods:

- `isLoaded(): boolean` - Checks if the model is currently loaded and ready for classification
- `classifyImage(imagePath: string): Promise<ClassificationResult>`
- `updateOptionsAndReload(newOptions: CustomImageLabelerOptions): Promise<void>`

## Types

### ImageLabelingConfig

```tsx
type ImageLabelingConfig = Record<string, {
  model: number; // Asset require number
  options?: {
    maxResultCount?: number;
    confidenceThreshold?: number;
  };
}>;
```

### ClassificationResult

```tsx
type ClassificationResult = Array<{
  text: string;
  index: number;
  confidence: number;
}>;
```
