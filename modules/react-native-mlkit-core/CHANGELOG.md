# @infinitered/react-native-mlkit-core

## 3.0.0

### Major Changes

- 83b7e6e: Standardize API patterns and coordinate structures across ML Kit modules

  1. Separates model operations into three hooks with simpler APIs
     1. loading the models, (`useObjectDetectionModels`, `useImageLabelingModels`)
     2. initializing the provider (`useObjectDetectionProvider`, `useImageLabelingProvider`)
     3. accessing models for inference, (`useObjectDetector`, `useImageLabeling`)
  2. Implements consistent naming patterns to make the APIs more legible
     - Removes "RNMLKit" prefix from non-native types
     - Use specific names for hooks (`useImageLabelingModels` instead of `useModels`)
     - Model configs are now `Configs`, instead of `AssetRecords`
  3. Moves base types into the `core` package to ensure consistency
  4. Fixes an issue with bounding box placement on portrait / rotated images on iOS
  5. Improves error handling and state management
  6. Updates documentation to match the new API

  ## Breaking Changes

  ### Image Labeling

  - Renamed `useModels` to `useImageLabelingModels` for clarity
  - Renamed `useImageLabeler` to `useImageLabeling`
  - Introduced new `useImageLabelingProvider` hook for cleaner context management
  - Added type-safe configurations with `ImageLabelingConfig`
  - Renamed model context provider from `ObjectDetectionModelContextProvider` to `ImageLabelingModelProvider`

  Here's how to update your app:

  #### Fetching the provider

  ```diff
  - const MODELS: AssetRecord = {
  + const MODELS: ImageLabelingConfig = {
   nsfwDetector: {
     model: require("./assets/models/nsfw-detector.tflite"),
     options: {
       maxResultCount: 5,
       confidenceThreshold: 0.5,
     }
   },
  };

  function App() {
  - const { ObjectDetectionModelContextProvider } = useModels(MODELS)
  + const models = useImageLabelingModels(MODELS)
  + const { ImageLabelingModelProvider } = useImageLabelingProvider(models)

   return (
  -   <ObjectDetectionModelContextProvider>
  +   <ImageLabelingModelProvider>
       {/* Rest of your app */}
  -   </ObjectDetectionModelContextProvider>
  +   </ImageLabelingModelProvider>
   )
  }
  ```

  #### Using the model

  ```diff
  - const model = useImageLabeler("nsfwDetector")
  + const detector = useImageLabeling("nsfwDetector")

  const labels = await detector.classifyImage(imagePath)
  ```

  ### Object Detection

  - `useObjectDetectionModels` now requires an `assets` parameter
  - `useObjectDetector` is now `useObjectDetection`
  - Introduced new `useObjectDetectionProvider` hook for context management
  - Renamed and standardized type definitions:
    - `RNMLKitObjectDetectionObject` → `ObjectDetectionObject`
    - `RNMLKitObjectDetectorOptions` → `ObjectDetectorOptions`
    - `RNMLKitCustomObjectDetectorOptions` → `CustomObjectDetectorOptions`
  - Added new types: `ObjectDetectionModelInfo`, `ObjectDetectionConfig`, `ObjectDetectionModels`
  - Moved model configuration to typed asset records
  - Default model now included in models type union

  Here's how to update your app:

  #### Fetching the provider

  ```diff

  - const MODELS: AssetRecord = {
  + const MODELS: ObjectDetectionConfig = {
    birdDetector: {
      model: require("./assets/models/bird-detector.tflite"),
      options: {
        shouldEnableClassification: false,
        shouldEnableMultipleObjects: false,
      }
    },
  };

  function App() {

  - const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
  -    assets: MODELS,
  -    loadDefaultModel: true,
  -    defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  -   })

  + const models = useObjectDetectionModels({
  +   assets: MODELS,
  +   loadDefaultModel: true,
  +   defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  + })
  +
  + const { ObjectDetectionProvider } = useObjectDetectionProvider(models)

    return (
  -    <ObjectDetectionModelContextProvider>
  +    <ObjectDetectionProvider>
         {/* Rest of your app */}
  -   </ObjectDetectionModelContextProvider>
  +   </ObjectDetectionProvider>
  )
  }

  ```

  #### Using the model

  ```diff
  - const {models: {birdDetector} = useObjectDetectionModels({
  -  assets: MODELS,
  -  loadDefaultModel: true,
  -   defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  - })
  -
  + const birdDetector = useObjectDetection("birdDetector")

  const objects = birdDetector.detectObjects(imagePath)
  ```

  ### Face Detection

  - Changed option naming conventions to match ML Kit SDK patterns:
  - `detectLandmarks` → `landmarkMode`
  - `runClassifications` → `classificationMode`
  - Changed default `performanceMode` from `accurate` to `fast`
  - Renamed hook from `useFaceDetector` to `useFaceDetection`
  - Renamed context provider from `RNMLKitFaceDetectionContextProvider` to `FaceDetectionProvider`
  - Added comprehensive error handling
  - Added new state management with `FaceDetectionState` type

  Here's how to update your app:

  #### Using the detector

  ```diff
  const options = {
  -  detectLandmarks: true,
  +  landmarkMode: true,
  -  runClassifications: true,
  +  classificationMode: true,
  }
  ```

  #### Using the provider

  ```diff
  - import { RNMLKitFaceDetectionContextProvider } from "@infinitered/react-native-mlkit-face-detection"
  + import { FaceDetectionProvider } from "@infinitered/react-native-mlkit-face-detection"

  function App() {
   return (
  -   <RNMLKitFaceDetectionContextProvider>
  +   <FaceDetectionProvider>
       {/* Rest of your app */}
  -   </RNMLKitFaceDetectionContextProvider>
  +   </FaceDetectionProvider>
   )
  }
  ```

  #### Using the hooks

  ```diff
  - const detector = useFaceDetector()
  + const detector = useFaceDetection()

  // useFacesInPhoto remains unchanged
  const { faces, status, error } = useFacesInPhoto(imageUri)
  ```

  ### Core Module

  - Introduced shared TypeScript interfaces:
    - `ModelInfo<T>`
    - `AssetRecord<T>`
  - Standardized frame coordinate structure
  - Implemented consistent type patterns

- b668ab0: Upgrade to expo 52

### Minor Changes

- b668ab0: align podspec platform requirements with expo version
- 213f085: fix: sets static builds in core podspec to prevent dependency conflicts

## 2.1.0

### Minor Changes

- 70cd8da: RNMLKitImage will now scale image to fill container by default. scaleFactor no longer accepts numbers.

## 2.0.0

### Major Changes

- 1e282e0: Update modules and example app to be compatible with Expo v51. Increases minimum deployment target to 13.4.

  To ensure that your app will be compatible, make sure your minimum deployment version is set higher than 13.4 by
  using the `expo-build-properties` plugin in your `app.json`.

  ```json
  {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "13.4"
          }
        }
      ]
    ]
  }
  ```

## 1.0.0

### Major Changes

- 4048d34: Updated modules to be compatible with Expo 50

### Minor Changes

- 4048d34: Upgrade expo and related deps to v50.
- 4048d34: Bump expo to v50

## 0.7.7

### Patch Changes

- 190d017: bump
- 55ba468: bump for ci test
- 7eb5434: Bump for CI
- fd2c513: bump for CI purposes

## 0.7.6

### Patch Changes

- f595da2: bump to trigger ci

## 0.7.5

### Patch Changes

- c2e52fc: bump version to trigger release action

## 0.7.4

### Patch Changes

- 09bea9d: bump to trigger docs deployment

## 0.7.3

### Patch Changes

- 90d6e74: bump to trigger docs deployment

## 0.7.2

### Patch Changes

- ebe42ad: bump to trigger docs deployment

## 0.7.1

### Patch Changes

- 5d3b30d: bump to test CI
- d1c784c: bump

## 0.7.0

### Minor Changes

- 8a3770d: bump for testing

### Patch Changes

- 8a3770d: change prepare to postinstall

## 0.6.9

### Patch Changes

- e84624c: bump to test CI

## 0.6.8

### Patch Changes

- 473c8df: test bump
- b74c44b: Build script update

## 0.6.7

### Patch Changes

- d52d34f: Bump to set version tags

## 0.6.6

### Patch Changes

- 0465390: style docs and fix deploy scripts

## 0.6.5

### Patch Changes

- 68a9bec: Bump

## 0.6.4

### Patch Changes

- 5ed9f17: Bump for testing

## 0.6.3

### Patch Changes

- 6cbb6fc: Bump to test release script

## 0.6.2

### Patch Changes

- 3d7866a: Remove skip-ci flag from version PRs

## 0.6.1

### Patch Changes

- 62486bb: Fix dependencies and bump version on all packages for safety
- c592f22: Add publish action for docs, and bump versions of packages to test.

## 0.6.0

### Minor Changes

- 799515e: Bumping version after rebase for safety.
- 1dd30dc: Fixing build scripts
- b70bbc0: Canges to typescript and eslint configs. Improved docs.
- 3a7d3a8: Create and import shared typescript configs

### Patch Changes

- 877cffb: docs changes and refactoring
- 8d53eb0: add dummy tests

## 0.5.0

### Minor Changes

- e0359c1: Fix release scripts

## 0.4.0

### Minor Changes

- 81e8fe2: Fix URLs in package.json

## 0.3.0

### Minor Changes

- 74e343a: remove dummy vars

## 0.2.0

### Minor Changes

- 71fdf60: Added tests and updated linter settings and scripts. Cleared linter errors.

## 0.1.0

### Minor Changes

- a287809: More testing
- a287809: Added a var to test changesets
