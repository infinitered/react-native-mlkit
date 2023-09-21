---
sidebar_position: 99
title: Options
---

# Object Detector Options

## Default Model

An `RNMLKitObjectDetectorOptions` object is used to configure the behavior of the object detection process. This
interface provides several optional properties that allow you to enable or disable certain features and set the mode of
the detector.

| Property                      | Type                          | Optional | Description                                            |
|:------------------------------|:------------------------------|----------|:-------------------------------------------------------|
| `shouldEnableClassification`  | `boolean`                     | Yes      | Enables or disables object classification.             |
| `shouldEnableMultipleObjects` | `boolean`                     | Yes      | Enables or disables the detection of multiple objects. |
| `detectorMode`                | `'singleImage'` \| `'stream'` | Yes      | Sets the mode of the detector.                         |                        |

For more information on these options see [the MLKit Docs](https://developers.google.com/ml-kit/vision/object-detection/ios#1.-configure-the-object-detector)

### Example Usage

```ts
const options: RNMLKitObjectDetectorOptions = {
  shouldEnableClassification: true,
  shouldEnableMultipleObjects: false,
  detectorMode: "stream",
};
```


