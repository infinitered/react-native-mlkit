---
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-core": major
---

# Breaking Changes

## Image Labeling

- Renamed `useModels` to `useImageLabelingModels` for better clarity and consistency
- Renamed `useImageLabeler` to `useImageLabeling`
- Introduced new `useImageLabelingProvider` hook for cleaner context management
- Added type-safe configurations with `ImageLabelingConfig` type
- Renamed model context provider from `ObjectDetectionModelContextProvider` to `ImageLabelingModelProvider`

## Object Detection

- `useObjectDetectionModels` now requires an `assets` parameter (previously optional)
- Introduced new `useObjectDetectionProvider` hook for context management
- Updated model access pattern to use provider-based architecture
- Renamed and standardized type definitions:
    - `RNMLKitObjectDetectionObject` → `ObjectDetectionObject`
    - `RNMLKitObjectDetectorOptions` → `ObjectDetectorOptions`
    - `RNMLKitCustomObjectDetectorOptions` → `CustomObjectDetectorOptions`
    - Added new types: `ObjectDetectionModelInfo`, `ObjectDetectionConfig`, `ObjectDetectionModels`
- Moved model configuration to typed asset records
- Default model now included in models type union

## Face Detection

- Changed option naming conventions to better align with ML Kit SDK patterns:
    - `detectLandmarks` → `landmarkMode`
    - `runClassifications` → `classificationMode`
- Changed default `performanceMode` from `accurate` to `fast`
- Updated frame coordinate structure to match other modules:
    - Old: `{x, y, width, height}`
    - New: `{origin: {x, y}, size: {width, height}}`
- Added comprehensive error handling
- Added new state management with `FaceDetectionState` type

## Core Module

- Added `expo-asset` as a required peer dependency
- Introduced shared TypeScript interfaces for model assets and configuration:
    - `ModelInfo<T>`
    - `AssetRecord<T>`
- Standardized frame coordinate structure across all detection modules
- Implemented consistent type patterns across all modules

## Migration Guide

1. Install peer dependency:

```bash
npm install expo-asset
# or
yarn add expo-asset
```

2. Update imports and hook names:

```diff
- import { useModels, useImageLabeler } from "@infinitered/react-native-mlkit-image-labeling"
+ import { useImageLabelingModels, useImageLabeling, useImageLabelingProvider } from "@infinitered/react-native-mlkit-image-labeling"
```

3. Update provider setup:

```diff
- const { ObjectDetectionModelContextProvider } = useModels(MODELS)
+ const models = useImageLabelingModels(MODELS)
+ const { ImageLabelingModelProvider } = useImageLabelingProvider(models)

- <ObjectDetectionModelContextProvider>
+ <ImageLabelingModelProvider>
```

4. Update model access pattern:

```diff
- const model = useObjectDetection("default")
+ const detector = useObjectDetection<MyModelsConfig>("modelName")
```

5. Update model configuration:

```diff
- const MODELS: AssetRecord = {
+ const MODELS: ImageLabelingConfig = {
   myModel: {
     model: require("./assets/models/model.tflite"),
     options: {
       maxResultCount: 5,
       confidenceThreshold: 0.5,
     },
   },
 }
```

6. Update face detection options:

```diff
const options = {
-  detectLandmarks: true,
-  runClassifications: true,
+  landmarkMode: true,
+  classificationMode: true,
}
```

7. Update frame coordinate access:

```diff
- const { x, y, width, height } = frame
+ const { origin: { x, y }, size: { width, height } } = frame
```
