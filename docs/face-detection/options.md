---
sidebar_position: 300
---

# Options

There are various options you can provide to the face detector to customize its behavior. Here's an example of what's
possible:

```tsx
import {
  RNMLKitFaceDetectorOptions,
  FaceDetectionProvider
} from "@infinitered/react-native-mlkit-face-detection";

const CUSTOM_OPTIONS: RNMLKitFaceDetectorOptions = {
  performanceMode: "accurate",  // 
  landmarkMode: true,
  classificationMode: true,
  minFaceSize: 0.01,
  isTrackingEnabled: true,
};

function App() {
  return (
    <FaceDetectionProvider options={CUSTOM_OPTIONS}>
      {/* rest of your app goes here */}
    </FaceDetectionProvider>
  );
}
```

## Available Options

Options for the face detector.

| Property             | Description                                                                                                                                                                                                                                              | Type                   | Default |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|---------|
| `performanceMode`    | The performance mode for the detector. Determines the trade-off between speed and accuracy. Use `'fast'` for real-time applications where speed is critical, and `'accurate'` for applications where higher accuracy is desired at the expense of speed. | `'fast' \| 'accurate'` | `fast`  |
| `landmarkMode`       | Indicates if landmark detection should be enabled.                                                                                                                                                                                                       | `boolean \| null`      | `null`  |
| `contourMode`        | Indicates if contour detection should be enabled.                                                                                                                                                                                                        | `boolean \| null`      | `null`  |
| `classificationMode` | Indicates if classification mode should be enabled.                                                                                                                                                                                                      | `boolean \| null`      | `null`  |
| `minFaceSize`        | Minimum size of the face for detection.                                                                                                                                                                                                                  | `number \| null`       | `null`  |
| `isTrackingEnabled`  | Indicates if tracking should be enabled for detected faces.                                                                                                                                                                                              | `boolean \| null`      | `null`  |
