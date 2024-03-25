---
sidebar_position: 99
title: Options
---

# Document Scanner Options

A `DocumentScannerOptions` object is used to configure the behavior of the document scanner. This interface provides several optional properties that allow you to enable or disable certain features, set the mode of the scanner and choose the format for the results.

| Property               | Type                  | Optional | Description                                                             |
|--:---------------------|--:--------------------|----------|--:----------------------------------------------------------------------|
| `pageLimit`            | `number`              | Yes      | The maximum number of pages that can be scanned.                        |
| `galleryImportAllowed` | `boolean`             | Yes      | Allow the user to choose images from gallery or force a new photograph. |
| `scannerMode`          | `ScannerModeOptions`  | Yes      | Sets the mode of the scanner.                                           |
| `resultFormats`        | `ResultFormatOptions` | Yes      | Sets the format of the scanned document results.                        |



For more information on these options
see [the MLKit Docs](https://developers.google.com/ml-kit/vision/doc-scanner/android)

### Example Usage

```ts
const options: DocumentScannerOptions = {
  pageLimit: 1,
  galleryImportAllowed: false,
  scannerMode: ScannerModeOptions.FULL,
  resultFormats: ResultFormatOptions.ALL,
};
```
