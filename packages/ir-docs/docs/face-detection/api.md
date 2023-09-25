---
sidebar_position: 999
slug: /react-native-mlkit/face-detection/api
title: API
---

# API

## Hooks

:::tip
All of these hooks must be called inside an `RNMLKitFaceDetectionContextProvider`.
:::

### `useFacesInPhoto`

Custom hook for detecting faces in a photo using ML Kit.

#### Parameters

- `imageUri?`: string - The local URI of the image to detect faces in.

#### Return Type

- `UseFaceDetectorReturnType`: Object

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

### `useFaceDetector`

Hook used to directly access the faceDetector instance provided by the context.

#### Return Type

- `faceDetector`: RNMLKitFaceDetector - Instance of the face detector.

#### Usage

```tsx
import { useFaceDetector } from "@infinitered/react-native-mlkit-face-detection";

const faceDetector = useFaceDetector();
// ... rest of your usage
```

## Context

### `ReactMLKitFaceDetectionContextValue`

Represents the context value for ML Kit Face Detection in React.

| Property       | Description                          | Type                  | Default |
|----------------|--------------------------------------|-----------------------|---------|
| `faceDetector` | Instance of the RNMLKitFaceDetector. | `RNMLKitFaceDetector` | -       |

### `ReactMLKitFaceDetectionContext`

The context for ML Kit Face Detection in React.

| Property       | Description                                  | Type                  | Default                               |
|----------------|----------------------------------------------|-----------------------|---------------------------------------|
| `faceDetector` | Default instance of the RNMLKitFaceDetector. | `RNMLKitFaceDetector` | New instance of `RNMLKitFaceDetector` |

### `RNMLKitFaceDetectionContextProvider`

A provider component for the ML Kit Face Detection context.

| Property              | Description                                    | Type                         | Default |
|-----------------------|------------------------------------------------|------------------------------|---------|
| `options`             | Options for the face detector.                 | `RNMLKitFaceDetectorOptions` | -       |
| `deferInitialization` | Defer the initialization of the face detector. | `boolean`                    | -       |
| `children`            | Children components.                           | `ReactNode`                  | -       |

Usage:

```tsx
import { RNMLKitFaceDetectionContextProvider } from 'path-to-context';

function App() {
  return (
    <RNMLKitFaceDetectionContextProvider options={yourOptions}>
      {/* Your components */}
    </RNMLKitFaceDetectionContextProvider>
  );
}
```





