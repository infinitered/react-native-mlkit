---
sidebar_position: 999
title: API
---

# API

## Hooks

:::tip
All of these hooks must be called inside an `FaceDetectionProvider`.
:::

### `useFacesInPhoto`

Custom hook for detecting faces in a photo using ML Kit.

#### Parameters

- `imageUri?`: string - The local URI of the image to detect faces in.

#### Return Type

- `UseFaceDetectionReturnType`: Object

    - `clearFaces`: Function - Clears the detected faces.
    - `error`: string | undefined - Any potential errors during detection.
    - `status`: FaceDetectionState - Status of the face detection.
    - `faces`: RNMLKitFace[] - Array of detected faces.

#### Usage

```tsx
import { useFacesInPhoto } from "@infinitered/react-native-mlkit-face-detection";

function FaceDetectionComponent() {
  const { faces, error, status } = useFacesInPhoto('local_uri_of_your_image_uri');
// ... rest of your component
}
```

### `useFaceDetection`

Hook used to directly access the faceDetector instance provided by the context.

#### Return Type

- `faceDetector`: RNMLKitFaceDetector - Instance of the face detector.

#### Usage

```tsx
import { useFaceDetection } from "@infinitered/react-native-mlkit-face-detection";

const faceDetector = useFaceDetection();
// ... rest of your usage
```

## Context

### `FaceDetectionContextValue`

Represents the context value for ML Kit Face Detection in React.

| Property       | Description                          | Type                  | Default |
|----------------|--------------------------------------|-----------------------|---------|
| `faceDetector` | Instance of the RNMLKitFaceDetector. | `RNMLKitFaceDetector` | -       |

### `FaceDetectionContext`

The context for ML Kit Face Detection in React.

| Property       | Description                                  | Type                  | Default                               |
|----------------|----------------------------------------------|-----------------------|---------------------------------------|
| `faceDetector` | Default instance of the RNMLKitFaceDetector. | `RNMLKitFaceDetector` | New instance of `RNMLKitFaceDetector` |

### `FaceDetectionProvider`

A provider component for the ML Kit Face Detection context.

| Property              | Description                                    | Type                         | Default |
|-----------------------|------------------------------------------------|------------------------------|---------|
| `options`             | Options for the face detector.                 | `RNMLKitFaceDetectorOptions` | -       |
| `deferInitialization` | Defer the initialization of the face detector. | `boolean`                    | -       |
| `children`            | Children components.                           | `ReactNode`                  | -       |

Usage:

```tsx
import { FaceDetectionProvider } from 'path-to-context';

function App() {
  return (
    <FaceDetectionProvider options={yourOptions}>
      {/* Your components */}
    </FaceDetectionProvider>
  );
}
```





