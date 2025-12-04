import { requireNativeModule } from "expo";
import { UnavailabilityError } from "expo-modules-core";

// Import the native module. On web, it will be resolved to RNMLKitBarcodeScanningModule.web.ts
// and on native platforms to RNMLKitBarcodeScanningModule.ts
import RNMLKitBarcodeScanningModule from "./module/RNMLKitBarcodeScanningModule";
import type { BarcodeScannerResult } from "./module/RNMLKitBarcodeScanning.types";

export * from "./module/RNMLKitBarcodeScanning.types";

interface RNMLKitBarcodeScanningModule {
  process: (imagePath: string) => Promise<BarcodeScannerResult>;
}

async function process(imagePath: string): Promise<BarcodeScannerResult> {
  return await barcodeScanningModule.process(imagePath);
}

const barcodeScanningModule = requireNativeModule<RNMLKitBarcodeScanningModule>("RNMLKitBarcodeScanning");

export { process}