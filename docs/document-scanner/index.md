---
sidebar_position: 1
title: Getting Started
---

# Document Scanner

## Getting Started

This is an expo module that lets you use
the [MLKit Document Scanner](https://developers.google.com/ml-kit/vision/doc-scanner) library in your Expo app.

## Installation

Install like any other npm package:

```bash
#yarn
yarn add @infinitered/@infinitered/react-native-mlkit-core react-native-mlkit-document-scanner

#npm
npm install @infinitered/@infinitered/react-native-mlkit-core react-native-mlkit-document-scanner
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
