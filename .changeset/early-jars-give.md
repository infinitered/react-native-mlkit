---
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-core": major
---

# Breaking Changes

## Image Labeling

- Renamed `useModels` to `useImageLabelingModels` for better clarity and consistency
- Renamed model context provider from `ObjectDetectionModelContextProvider` to `ImageLabelingContextProvider`
- Updated model context types to support consistent type patterns across modules

## Object Detection

- `useObjectDetectionModels` now requires an `assets` parameter (previously optional)
- Removed `useObjectDetector` hook - models are now accessed directly through `useObjectDetectionModels`
- Context value structure changed: models are now spread directly into context instead of being nested under a `models`
  property
- Type definitions updated:
- `AssetRecord` renamed to `ObjectDetectionAssetRecord`
- `ModelInfo` renamed to `ObjectDetectionModelInfo`
- `Models` type renamed to `ObjectDetectionModels`

## Face Detection

- Changed option naming conventions to better align with ML Kit SDK patterns:
- `detectLandmarks` renamed to `landmarkMode`
- `runClassifications` renamed to `classificationMode`
- Changed default `performanceMode` from `accurate` to `fast`
- Updated frame coordinate structure to match other modules:
- Old: `{x, y, width, height}`
- New: `{origin: {x, y}, size: {width, height}}`

## Core Module

- Added `expo-asset` as a required peer dependency
- Introduced shared TypeScript interfaces for model assets and configuration
- Standardized frame coordinate structure across all detection modules

## Migration Guide

1. Update imports and hook names:

  ```diff
  - import { useModels } from "@infinitered/react-native-mlkit-image-labeling"
  + import { useImageLabelingModels } from "@infinitered/react-native-mlkit-image-labeling"
  ```

2. Update provider components:

  ```diff
  - <ObjectDetectionModelContextProvider>
  + <ImageLabelingContextProvider>
  ```

3. Update model access pattern:

  ```diff
  - const model = useObjectDetector("default")
  + const { models: { default: model } } = useObjectDetectionModels({
  +   assets: MODELS,
  +   loadDefaultModel: true,
  +   defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  + })
  ```

4. Install peer dependency:

  ```bash
  npm install expo-asset
  # or
  yarn add expo-asset
  ```

5. Update face detection options:

  ```diff
  const options = {
  -  detectLandmarks: true,
  -  runClassifications: true,
  +  landmarkMode: true,
  +  classificationMode: true,
  }
  ```

6. Update frame coordinate access:

  ```diff
  - const { x, y, width, height } = frame
  + const { origin: { x, y }, size: { width, height } } = frame
  ```
