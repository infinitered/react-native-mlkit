---
sidebar_position: 99
---

# Image Labeler Options

The MLKit Image Labeler can be configured with various options to control its behavior. These options can be set both
during initialization and updated at runtime.

## Available Options

### CustomImageLabelerOptions

```typescript
type ImageLabelingConfig = Record<string, {
  model: number // the number returned from `require()`
  options?: CustomImageLabelerOptions;
}>;

type CustomImageLabelerOptions = {
  maxResultCount?: number;     // Maximum number of classifications to return
  confidenceThreshold?: number; // Minimum confidence score (0-1) for results
};
```

## Setting Options

### During Initialization

```tsx
const MODELS: ImageLabelingConfig = {
  myModel: {
    model: require("./assets/models/model.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0.7,
    },
  },
};
```

### Updating Options at Runtime

You can update options for a loaded model using the classifier's `updateOptionsAndReload` method:

```tsx
const classifier = useImageLabeling("myModel");

// Update options
await classifier.updateOptionsAndReload({
  maxResultCount: 3,
  confidenceThreshold: 0.8,
});
```

