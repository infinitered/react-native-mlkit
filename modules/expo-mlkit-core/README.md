# @infinitered/expo-mlkit-core

## Description

This is a shared library for ExpoMLKit that contains helper functions and shared code for various packages. It offers
some helpful methods that are used by many apps on the React Native (JS) side and includes functionality to work with
images and bounding boxes.

## Installation

Use the following command to install the package:

```bash
npm install @infinitered/expo-mlkit-core
```

## Usage

### ExpoMLKitImage

#### Swift

Use this class in Swift to create and manage images with MLKitVision. It provides utility methods for loading images and
managing their vision representations.

```swift
import ExpoMLKitCore
let image = ExpoMLKitImage(imagePath: imagePath)
// ...
```

* `imagePath` - should be the localUri of the image to process. i.e. `Asset.localUri` from an Expo Asset or `Image.uri`
  from
  an ImagePickerAsset.

#### Kotlin

Use this class in Kotlin to create and manage images with MLKitVision. It provides utility methods for loading images
and managing their vision representations.

```kotlin
import com.infinitered.expomlkitcore.ExpoMLKitImage

val imageUri = Uri.parse(imagePath)
var image:InputImage = ExpoMLKitImage(imagePath, appContext.reactContext!!).image
// ...
```

* `imagePath` is the localUri of the image to process.  `Asset.localUri` from an Expo Asset or `Image.uri` from an Expo
  ImagePickerAsset.
* `appContext` is the AppContext from your expo module -- it's accessible as a property on the Module class.

### React Components

#### BoundingBoxView

Renders a bounding box based on the specified dimensions and scale.

```jsx
import { BoundingBoxView } from "@infinitered/expo-mlkit-core";
// ...
<BoundingBoxView box={box} scale={scale} />;
```

* `box` is the bounding box to render of type `BoundingBox`

```ts
/**
 * Represents a bounding box with origin, size, color, label, and width properties.
 */
export interface BoundingBox {
  origin: { x: number; y: number };
  size: { x: number; y: number };
  color?: string;
  label?: string;
  width?: number;
}
```

#### ImageWithBoundingBoxes

Renders an image with bounding boxes drawn over specified regions.

```jsx
import { ImageWithBoundingBoxes } from "@infinitered/expo-mlkit-core";
// ...
<ImageWithBoundingBoxes image={image} boundingBoxes={boundingBoxes} />;
```

* `boundingBoxes` is an array of `BoundingBox` objects to render over the image.
* `image` is the image to render. Accepts an `Image` from `expo-image`

### Hooks

Several hooks are included to assist with layout and scaling:

- `useBoundingBoxStyle`: Calculates the style object for a bounding box.
- `useImageScale`: Calculates the image scale based on the provided parameters.
- `useLayout`: Handles layout change events.
