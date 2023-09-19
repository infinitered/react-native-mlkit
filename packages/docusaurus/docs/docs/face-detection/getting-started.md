---
sidebar_position: 100
slug: /face-detection
title: Getting Started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting Started

## Prerequisites

`react-native-mlkit-face-detection` is an [Expo Module](https://docs.expo.dev/modules/overview/). And is compatible with
both the Managed and Bare workflows.

### Managed Workflow

`react-native-mlkit-face-detection` is compatible with the Expo Managed Workflow out of the box. No additional setup is required!

### Workflow

To use the module, you'll need to install and configure the `expo` package. See the [expo docs](https://docs.expo.dev/bare/installing-expo-modules/) for instructions.


## 1. Installation

Add the package to your project using your favorite package manager:

```bash
yarn add @infinitered/react-native-mlkit-face-detection
```

## 2. Setting Up the Context

Wrap your app with the `RNMLKitFaceDetectionContextProvider` component.

```tsx
// App.tsx

import {
  RNMLKitFaceDetectionContextProvider,
} from "@infinitered/react-native-mlkit-face-detection";

function App() {
  return (
    <RNMLKitFaceDetectionContextProvider>
      {/* rest of your app goes here */}
    </RNMLKitFaceDetectionContextProvider>
  );
}
```

:::tip
By default, the face detection is automatically initialized and loaded into memory when created, which can have a
significant impact on the performance of your app. The [Advanced Usage](./advanced-usage/#2-deferred-initialization)
guide has instructions on how to defer this initialization.
:::

:::tip
You can set custom options for the face detector by passing them to the `options` prop. More info available on
the [Options](./options) page.
:::

## Basic Usage: Detecting Faces in Photos

Once the provider is in place, use the `useFacesInPhoto` hook. This hook will allow you to detect faces in any photo by
simply passing the image's URI.

```tsx
import { useFacesInPhoto } from "@infinitered/react-native-mlkit-face-detection";

function FaceDetectionComponent() {
  const { faces, error, status } = useFacesInPhoto('local_uri_of_your_image_uri');

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (<View>
    {faces.map((face) => (
      <View key={face.trackingId}>
        <Text>{JSON.stringify(face)}</Text>
      </View>
    ))}
  </View>)
}
```

Now, you're set to incorporate face detection into your application! If you're looking for more control or advanced
features, check out our [Advanced Usage](./advanced-usage) guide.
