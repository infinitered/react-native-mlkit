---
sidebar_position: 1
title: Getting Started
---

# Object Detection

## Getting Started

This is an expo module that lets you use
the [MLKit Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition/v2) library in your Expo app.

## Installation

Install like any other npm package:

```bash
#yarn
yarn add @infinitered/react-native-mlkit-text-recognition

#npm
npm install @infinitered/react-native-mlkit-text-recognition
```

## Basic Usage

The models are made available through the context system. You can access them in your components using the same hook

```tsx
// MyComponent.tsx
import { recognizeText } from "@infinitered/react-native-mlkit-text-recognition";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import type { MyModelsConfig } from "./App";

type Props = {
  imagePath: string;
};

function MyComponent({ imagePath }: Props) {
  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  useEffect(() => {
    async function recognizeTextAsync(imagePath: string) {
      try {
        const { text } = await recognizeText(imagePath);
        setRecognizedText(text);
      } catch (error) {
        console.error("Error recognizing text:", error);
      }
    }

    if (imagePath) {
      recognizeTextAsync(imagePath);
    }
  }, [imagePath]);

  return (
    <View>
      <Text>{recognizedText}</Text>
    </View>
  );
}
```

### Recognition Results

The `recognizeText` method returns an `Text` object:

```ts
interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TextBase {
  text: string;
  frame: Rect;
  recognizedLanguage: string;
}

interface TextElement extends TextBase {}

interface TextLine extends TextBase {
  elements: TextElement[];
}

interface TextBlock extends TextBase {
  lines: TextLine[];
}

interface Text {
  text: string;
  textBlocks: TextBlock[];
}
```
