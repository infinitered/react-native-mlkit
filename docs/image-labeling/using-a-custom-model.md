---
sidebar_position: 99
---

# Using a Custom Model

MLKit includes a general-purpose image labeling model that recognizes more than 400 entities covering common concepts in
photos. However, you may want to use your own custom model for specific use cases.

## Compatible Models

Your custom model needs to be compatible with MLKit's Image Labeling API:

- The model must be a TensorFlow Lite model (.tflite)
- The model must be configured for classification tasks
- The output should provide class labels and confidence scores

Refer to [Custom Models with MLKit](https://developers.google.com/ml-kit/custom-models) for detailed information on
MLKit model compatibility.

## Implementation Steps

### 1. Add your model to the project

Place your model in your project's assets directory:

```bash
cp ~/my-custom-model.tflite ./assets/models/my-custom-model.tflite
```

### 2. Configure Metro bundler

Update your metro.config.js to handle .tflite files:

```javascript
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("tflite");

module.exports = config;

```

### 3. Configure the model in your app

```tsx
import { ImageLabelingConfig } from '@infinitered/react-native-mlkit-image-labeling';

const MODELS: ImageLabelingConfig = {
  customModel: {
    model: require("./assets/models/my-custom-model.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0.7,
    },
  },
};

```

### 4. Use the model in your components

```tsx
function CustomModelClassifier() {
  const classifier = useImageLabeling("customModel");

  const classify = async (imageUri: string) => {
    try {
      const results = await classifier.classifyImage(imageUri);
      // Handle classification results
    } catch (error) {
      // Handle errors
    }
  };
}

```

## Model Options

You can configure your model's behavior using these options:

```tsx
type CustomImageLabelerOptions = {
  maxResultCount?: number; // Maximum number of classifications to return
  confidenceThreshold?: number; // Minimum confidence score (0-1) for results
};
```

## Updating Model Options

You can update the model's options at runtime:

```tsx
await classifier.updateOptionsAndReload({
  maxResultCount: 3,
  confidenceThreshold: 0.8,
});
```

See the [Expo Docs](https://docs.expo.dev/guides/customizing-metro/#adding-more-file-extensions-to-assetexts) for
detailed instructions on [customizing metro](https://docs.expo.dev/guides/customizing-metro).

