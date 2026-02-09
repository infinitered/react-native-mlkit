---
sidebar_position: 1
title: Getting Started
---

# Barcode Scanner

## Getting Started

This is an expo module that lets you use the [MLKit Barcode Scanning](https://developers.google.com/ml-kit/vision/barcode-scanning) library in your Expo app. It supports both Android and iOS platforms.

## Installation

Install like any other npm package:

```bash
#yarn
yarn add @infinitered/react-native-mlkit-barcode-scanning

#npm
npm install @infinitered/react-native-mlkit-barcode-scanning
```

## Basic Usage

### 1. Initialize the barcode scanner

Before scanning, you need to initialize the scanner with your desired [options](./options).

```tsx
import RNMLKitBarcodeScanningModule, {
  BarcodeFormat,
} from "@infinitered/react-native-mlkit-barcode-scanning";
import type { BarcodeScannerOptions } from "@infinitered/react-native-mlkit-barcode-scanning";

const options: BarcodeScannerOptions = {
  barcodeFormats: [BarcodeFormat.ALL],
};

await RNMLKitBarcodeScanningModule.initialize(options);
```

### 2. Process an image for barcodes

Once initialized, pass an image path to the `process` method to scan for barcodes.

```tsx
const result = await RNMLKitBarcodeScanningModule.process(imagePath);

// result.barcodes contains an array of detected barcodes
for (const barcode of result.barcodes) {
  console.log("Format:", barcode.format);
  console.log("Value:", barcode.displayValue);
  console.log("Type:", barcode.valueType);
}
```

### 3. Full example

Here's a complete example showing how to scan barcodes from an image:

```tsx
import React, { useState } from "react";
import { View, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import RNMLKitBarcodeScanningModule, {
  BarcodeFormat,
} from "@infinitered/react-native-mlkit-barcode-scanning";
import type {
  BarcodeScannerOptions,
  BarcodeScannerResult,
} from "@infinitered/react-native-mlkit-barcode-scanning";

const DEFAULT_OPTIONS: BarcodeScannerOptions = {
  barcodeFormats: [BarcodeFormat.ALL],
};

function BarcodeScannerExample() {
  const [result, setResult] = useState<BarcodeScannerResult | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const scanBarcode = async () => {
    // Pick an image
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;
    setImageUri(uri);

    // Initialize and scan
    await RNMLKitBarcodeScanningModule.initialize(DEFAULT_OPTIONS);
    const scanResult = await RNMLKitBarcodeScanningModule.process(uri);
    setResult(scanResult);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button onPress={scanBarcode} title="Select Image to Scan" />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginVertical: 16 }}
        />
      )}

      {result && result.barcodes.length > 0 && (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            Found {result.barcodes.length} barcode(s):
          </Text>
          {result.barcodes.map((barcode, index) => (
            <View key={index} style={{ marginTop: 8 }}>
              <Text>Format: {barcode.format}</Text>
              <Text>Type: {barcode.valueType}</Text>
              <Text>Value: {barcode.displayValue}</Text>
            </View>
          ))}
        </View>
      )}

      {result && result.barcodes.length === 0 && (
        <Text>No barcodes found in the image.</Text>
      )}
    </View>
  );
}
```

## Supported Barcode Formats

The scanner supports the following barcode formats:

| Format       | Description                          |
| ------------ | ------------------------------------ |
| `ALL`        | Scan for all supported formats       |
| `code128`    | Code 128 barcode                     |
| `code39`     | Code 39 barcode                      |
| `code93`     | Code 93 barcode                      |
| `codaBar`    | Codabar barcode                      |
| `dataMatrix` | Data Matrix 2D barcode               |
| `EAN13`      | EAN-13 barcode                       |
| `EAN8`       | EAN-8 barcode                        |
| `ITF`        | ITF (Interleaved 2 of 5) barcode     |
| `qrCode`     | QR Code                              |
| `UPCA`       | UPC-A barcode                        |
| `UPCE`       | UPC-E barcode                        |
| `PDF417`     | PDF417 barcode                       |
| `aztec`      | Aztec 2D barcode                     |

:::tip Performance Tip
For better performance, specify only the barcode formats you need instead of using `BarcodeFormat.ALL`. This reduces processing time by limiting the scanner to specific formats.
:::

## Barcode Value Types

The scanner automatically detects the type of content encoded in a barcode. The `valueType` property indicates what kind of data was found:

| Value Type        | Description                                      |
| ----------------- | ------------------------------------------------ |
| `TEXT`            | Plain text                                       |
| `URL`             | URL/web link                                     |
| `EMAIL`           | Email address (with optional subject/body)       |
| `PHONE`           | Phone number                                     |
| `SMS`             | SMS message (phone number and message)           |
| `WIFI`            | Wi-Fi network credentials                        |
| `GEO`             | Geographic coordinates                           |
| `CONTACT_INFO`    | Contact information (vCard)                      |
| `CALENDAR_EVENT`  | Calendar event                                   |
| `DRIVER_LICENSE`  | Driver's license information                     |
| `ISBN`            | ISBN book identifier                             |
| `PRODUCT`         | Product code                                     |
| `UNKNOWN`         | Unknown or unrecognized type                     |

Based on the `valueType`, additional properties will be populated on the barcode object. For example, a barcode with `valueType: "WIFI"` will have a `wifi` property containing `ssid`, `password`, and `type` fields.

## API Reference

### Methods

#### `initialize(options: BarcodeScannerOptions): Promise<void>`

Initializes the barcode scanner with the specified options. Must be called before `process()`.

#### `process(imagePath: string): Promise<BarcodeScannerResult>`

Processes an image and returns any detected barcodes. The `imagePath` should be a valid local file URI.

### Types

#### `BarcodeScannerOptions`

```ts
interface BarcodeScannerOptions {
  barcodeFormats?: BarcodeFormat[];
  enableAllPotentialBarcodes?: boolean;
}
```

| Property                     | Type             | Description                                              |
| ---------------------------- | ---------------- | -------------------------------------------------------- |
| `barcodeFormats`             | `BarcodeFormat[]`| Array of barcode formats to scan for. Defaults to `ALL`. |
| `enableAllPotentialBarcodes` | `boolean`        | Enable detection of potential barcodes even if they can't be fully decoded. **Android only.** |

#### `BarcodeScannerResult`

```ts
interface BarcodeScannerResult {
  barcodes: Barcode[];
}
```

#### `Barcode`

```ts
interface Barcode {
  frame: RNMLKitRect;
  rawValue?: string;
  rawData?: BarcodeRawData;
  displayValue?: string;
  format: BarcodeFormat;
  cornerPoints: RNMLKitPoint[];
  valueType: BarcodeValueType;
  // Type-specific properties
  email?: BarcodeEmail;
  phone?: BarcodePhone;
  sms?: BarcodeSMS;
  url?: BarcodeURLBookmark;
  wifi?: BarcodeWifi;
  geoPoint?: BarcodeGeoPoint;
  contactInfo?: BarcodeContactInfo;
  calendarEvent?: BarcodeCalendarEvent;
  driverLicense?: BarcodeDriverLicense;
}
```

| Property       | Type                  | Description                                           |
| -------------- | --------------------- | ----------------------------------------------------- |
| `frame`        | `RNMLKitRect`         | Bounding box of the barcode in the image              |
| `rawValue`     | `string`              | Raw string value encoded in the barcode               |
| `rawData`      | `BarcodeRawData`      | Raw bytes of the barcode data                         |
| `displayValue` | `string`              | Human-readable value (may differ from rawValue)       |
| `format`       | `BarcodeFormat`       | The format/type of barcode detected                   |
| `cornerPoints` | `RNMLKitPoint[]`      | Corner coordinates of the barcode                     |
| `valueType`    | `BarcodeValueType`    | The semantic type of the barcode content              |

For more details on the ML Kit Barcode Scanning API, see the [official documentation](https://developers.google.com/ml-kit/vision/barcode-scanning).