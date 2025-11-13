---
sidebar_position: 1
title: Getting Started
---

# Document Scanner

## Getting Started

This is an expo module that lets you use
the [MLKit Document Scanner](https://developers.google.com/ml-kit/vision/doc-scanner) library in your Expo app.

:::warning
ML Kit does not provide a Document Scanning module for iOS, so this feature is **not supported on iOS**.

This limitation comes from Google’s ML Kit itself and cannot be addressed by this library.

If you need document scanning on iOS, here are some popular React Native packages that support it:

- [@dariyd/react-native-document-scanner](https://www.npmjs.com/package/%40dariyd/react-native-document-scanner) — iOS (VisionKit) + Android (ML Kit)
- [react-native-document-scanner-plugin](https://www.npmjs.com/package/react-native-document-scanner-plugin) — lightweight, supports both platforms
- [@thegrizzlylabs/react-native-genius-scan](https://www.npmjs.com/package/@thegrizzlylabs/react-native-genius-scan) — commercial, full-featured scanning SDK
:::


## Installation

Install like any other npm package:

```bash
#yarn
yarn add @infinitered/react-native-mlkit-document-scanner

#npm
npm install @infinitered/react-native-mlkit-document-scanner
```

## Basic Usage

### 1. Launch the document scanner from a button press

Use the `launchDocumentScannerAsync` method to initiate the document scanner modal.

```tsx
// App.tsx
import { View, Button } from "react-native";
import { launchDocumentScannerAsync } from "@infinitered/react-native-mlkit-document-scanner";

function App() {
  return (
    <View>
      <Button
        onPress={async () => {
          // result will contain an object with the result information
          const result = await launchDocumentScannerAsync({
            pageLimit: 1,
            galleryImportAllowed: false,
            resultFormats: ResultFormatOptions.ALL,
          });
        }}
        title="Scan Document"
      />
    </View>
  );
}
```
