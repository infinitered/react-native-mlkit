---
sidebar_position: 200
---

# Advanced Usage

For users looking for more granular control over face detection or wanting to explore advanced features, this guide
dives deeper.

## 1. Direct Access to the Face Detector

For advanced scenarios, you might want direct access to the face detector instance. The `useFaceDetector` hook allows
you to get the instance and work with it directly.

```tsx

import {
  useFaceDetector,
  RNMLKitFaceDetectorOptions,
  RNMLKitFaceDetector
} from "@infinitered/react-native-mlkit-face-detection";

function AdvancedFaceComponent() {
  const faceDetector = useFaceDetector();

  // You can now call methods directly on the faceDetector instance
  // Example:
  const result = faceDetector.detectFaces('local_uri_of_your_image_uri');


  // or initialize the detector with or without custom options
  const initializeDetector = React.useCallback((options: RNMLKitFaceDetectorOptions | undefined) => {
    faceDetector.initialize(options);
  }, [faceDetector]);

  // rest of your component
}
```

[link](#2-deferred-initialization)

:::tip
The `useFaceDetector` hook gives you maximum flexibility but requires a deeper understanding of the detector's API.
Always refer back to the official documentation if in doubt.
:::

## 2. Deferred Initialization

By default, the face detector initializes immediately upon the component's mount. However, in scenarios where you'd like
to defer this initialization (maybe due to performance considerations or user-triggered actions), you can do so by
setting the `deferInitialization` flag prop.

```tsx
function App() {
  return (
    <RNMLKitFaceDetectionContextProvider
      options={FACE_DETECTION_OPTIONS}
      deferInitialization
    >
      {/* rest of your app goes here */}
    </RNMLKitFaceDetectionContextProvider>
  );
}
```

Then, when you're ready to initialize the detector you can simply call the `initialize` method:

```tsx
import { useEffect } from "react";

function MyComponent() {
  const detector = useFaceDetector();
  useEffect(() => {
    detector.initialize();
  }, []);

  //...rest of your component
}
```

:::caution
Remember that the face detector will not work until it's initialized.

Ensure that it's initialized before trying to detect faces with it.
:::

## Error Handling

The face detector includes built-in error handling that will update the detector's status to `'error'` and log error
messages to the console. When using the detector directly, you should handle potential errors:

```tsx
const detectFaces = async () => {
  try {
    const result = await faceDetector.detectFaces(imageUri);
    if (!result) {
      // Handle undefined result case
      return;
    }
    // Process result.faces
  } catch (error) {
    // Handle error case
    console.error('Face detection failed:', error);
  }
};
```

That's it for the advanced usage! Dive deep, and feel free to ask any questions in the community forums.

