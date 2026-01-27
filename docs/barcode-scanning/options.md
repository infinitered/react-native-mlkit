---
sidebar_position: 99
title: Options
---

# Barcode Scanner Options

A `BarcodeScannerOptions` object is used to configure the behavior of the barcode scanner. This interface provides optional properties that allow you to specify which barcode formats to scan for and enable additional detection features.

| Property                     | Type              | Optional | Description                                                                      |
| ---------------------------- | ----------------- | -------- | -------------------------------------------------------------------------------- |
| `barcodeFormats`             | `BarcodeFormat[]` | Yes      | Array of barcode formats to scan for. Defaults to `ALL` if not specified.        |
| `enableAllPotentialBarcodes` | `boolean`         | Yes      | Enable detection of potential barcodes even if they can't be fully decoded. **Android only.** |

For more information on these options, see [the MLKit Docs](https://developers.google.com/ml-kit/vision/barcode-scanning/android).

### Example Usage

```ts
import { BarcodeFormat } from "@infinitered/react-native-mlkit-barcode-scanning";
import type { BarcodeScannerOptions } from "@infinitered/react-native-mlkit-barcode-scanning";

// Scan for all barcode formats
const allFormatsOptions: BarcodeScannerOptions = {
  barcodeFormats: [BarcodeFormat.ALL],
};

// Scan only for QR codes and EAN-13 barcodes (better performance)
const specificFormatsOptions: BarcodeScannerOptions = {
  barcodeFormats: [BarcodeFormat.qrCode, BarcodeFormat.EAN13],
};

// Enable detection of partial/potential barcodes (Android only)
const potentialBarcodesOptions: BarcodeScannerOptions = {
  barcodeFormats: [BarcodeFormat.ALL],
  enableAllPotentialBarcodes: true,
};
```

### Available Barcode Formats

The `BarcodeFormat` enum provides the following values:

| Format       | Value          | Description                      |
| ------------ | -------------- | -------------------------------- |
| `ALL`        | `"all"`        | Scan for all supported formats   |
| `code128`    | `"code128"`    | Code 128 barcode                 |
| `code39`     | `"code39"`     | Code 39 barcode                  |
| `code93`     | `"code93"`     | Code 93 barcode                  |
| `codaBar`    | `"codaBar"`    | Codabar barcode                  |
| `dataMatrix` | `"dataMatrix"` | Data Matrix 2D barcode           |
| `EAN13`      | `"EAN13"`      | EAN-13 barcode                   |
| `EAN8`       | `"EAN8"`       | EAN-8 barcode                    |
| `ITF`        | `"ITF"`        | ITF (Interleaved 2 of 5) barcode |
| `qrCode`     | `"qrCode"`     | QR Code                          |
| `UPCA`       | `"UPCA"`       | UPC-A barcode                    |
| `UPCE`       | `"UPCE"`       | UPC-E barcode                    |
| `PDF417`     | `"PDF417"`     | PDF417 barcode                   |
| `aztec`      | `"AZTEC"`      | Aztec 2D barcode                 |

:::tip Performance Tip
For better scanning performance, specify only the barcode formats you expect to encounter rather than using `BarcodeFormat.ALL`. This reduces processing overhead and can significantly improve scan speed.
:::
