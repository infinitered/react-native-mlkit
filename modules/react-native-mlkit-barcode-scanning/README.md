# @infinitered/react-native-mlkit-image-labeling

### [Check the friendly docs here! 📖](https://docs.infinite.red/react-native-mlkit/image-labeling)

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
