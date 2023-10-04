---
sidebar_position: 1
title: Getting Started
---

# react-native-mlkit-image-labeling

This is the introduction to the documentation.

## Overview

`react-native-mlkit-image-labeling` provides utilities for image classification using ML Kit in React Native
apps. It allows for the classification of images to determine their content, such as identifying if an image is NSFW.
•

## Installation

```
npm install @infinitered/react-native-mlkit-image-labeling
```

## Usage

**1. Import necessary hooks and types:**

```ts
import {
  useImageLabeler,
  ClassificationResult,
  AssetRecord,
} from "@infinitered/react-native-mlkit-image-labeling";
```

**2. Define your model and options:**

Create an `AssetRecord` which identifies the model file and set the options.

```ts
const MODELS: AssetRecord = {
  nsfw: {
    model: require("./path/to/model.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0,
    },
  },
};
```

**3. Using the image labeler in your component:**

- Initialize the image labeler for a specific model.

  ```ts
  const model = useImageLabeler("nsfw");
  ```

- Classify an image by passing its URI.
  ```ts
  const classificationResult = await model.classifyImage(image.uri);
  ```

## Components & Hooks

- **useImageLabeler(modelName: string)**

    - Returns an instance of the image labeler for the specified model.
    - `modelName`: The name of the model as defined in your `MODELS` object.

- **ClassificationResult**
    - Type definition for the result of the image classification. It includes:
        - `text`: Label of the classification.
        - `confidence`: A decimal value between 0 and 1 indicating the confidence level of the classification.



 
