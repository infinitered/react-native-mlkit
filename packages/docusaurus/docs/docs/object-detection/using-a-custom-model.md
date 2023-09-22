---
sidebar_position: 3
slug: /object-detection/using-a-custom-model
---

# Using a custom model

:::tip
Your custom model needs to be compatible with MLKit. Refer
to [Custom Models with MLKit](https://developers.google.com/ml-kit/custom-models) for general information on
MLKit model compatibility, and specifically the section
on [TensorFlow Lite model compatibility](https://developers.google.com/ml-kit/custom-models#model-compatibility).
:::

## 1. Add your model to the project

Place your model somewhere that makes sense in your project. For example, you might place it in `assets/models/`.

```bash
cp ~/my-custom-model.tflite ./assets/models/my-custom-model.tflite
```

## 2. Configure Metro to bundle TFLite files

Metro usually ignores unknown file types when bundling the app.

Update your metro config so Metro knows to include `.tflite` files in the app bundle.

To do this, create / edit your `./metro.config.js` file:

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.tflite` files for TFLite models
  "tflite"
);

module.exports = config;
```

See the [Expo Docs](https://docs.expo.dev/guides/customizing-metro/#adding-more-file-extensions-to-assetexts) for
detailed instructions on [customizing metro](https://docs.expo.dev/guides/customizing-metro).

## 3. Set up the model context provider

First define an `AssetRecord` object with the details of your model. An asset record is a map of model names to model
details.

```ts
type ModelInfo = {
  model: number;
  options?: RNMLKitCustomObjectDetectorOptions;
};
```

For a list of options for the default models, see the [Options](/object-detection/options) page.

```js
// App.tsx

import {
  AssetRecord,
  useObjectDetectionModels,
} from "react-native-mlkit-object-detection";

const MODELS: AssetRecord = {
  // the name you'll use to refer to the model
  myCustomModel: {
    // the relative path to the model file
    asset: require("./assets/models/my-custom-model.tflite"),
    options: {
      // the options you want to use for this model
      shouldEnableMultipleObjects: false,
      shouldEnableClassification: false,
      detectorMode: "singleImage",
    },
  },
};

// For descriptions of options for default models see link below this snipped.
function App() {
  // fetch the provider component from the hook
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    models: MODELS,
    loadDefaultModel: false,
  });

  return (
    <ObjectDetectionModelContextProvider>
      // Rest of your app
    </ObjectDetectionModelContextProvider>
  );
}
```

## 3. Fetch the model using the `useObjectDetectionModel` hook, and use it to detect objects in an image

```tsx
// MyComponent.tsx
import {
  useObjectDetector,
  RNMLKitDetectedObject,
} from "@infinitered/react-native-mlkit-object-detection";

function MyComponent() {
  // fetch the model from the hook, if you don't pass a model name it will fetch the default MLKit Object Detection model
  const { model } = useObjectDetector("myCustomModel");

  const [modelLoaded, setModelLoaded] = useState(model?.isLoaded() ?? false);

  // Models must be loaded before they can be used. This can be slow, and consume
  // a lot of resources so consider carefully where and when to load the model
  React.useEffect(() => {
    // Loading models is done asynchronously, so in a useEffect we need to wrap it in an async function
    async function loadModel() {
      if (!model || modelIsLoaded) return;
      // load the model
      await model.load();
      // set the model loaded state to true
      setModelLoaded(true);
    }

    loadModel();
  }, [model, modelIsLoaded]);

  // the output of the model is an array of `RNMLKitDetectedObject` objects
  const [result, setResult] = useState<RNMLKitDetectedObject[]>([]);

  useEffect(() => {
    if (!modelLoaded) return;

    // model.detectObjects is async, so when we use it in a useEffect, we need to wrap it in an async function
    async function detectObjects(image: AssetRecord) {
      const result = await model.detectObjects(image);
      setResult(result);
    }

    detectObjects();
  }, [model, modelLoaded]);

  return <View>{JSON.stringify(result)}</View>;
}
```
