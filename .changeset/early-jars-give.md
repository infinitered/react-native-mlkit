---
"@infinitered/react-native-mlkit-object-detection": major
"@infinitered/react-native-mlkit-image-labeling": major
"@infinitered/react-native-mlkit-core": major
---

Standardize API patterns and coordinate structures across ML Kit modules

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
