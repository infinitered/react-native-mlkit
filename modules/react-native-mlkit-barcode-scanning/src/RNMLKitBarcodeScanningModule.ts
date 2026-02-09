import { NativeModule, requireNativeModule } from "expo";

import {
  BarcodeScannerOptions,
  BarcodeScannerResult,
} from "./RNMLKitBarcodeScanning.types";

declare class RNMLKitBarcodeScanningModule extends NativeModule {
  initialize(options: BarcodeScannerOptions): Promise<void>;
  process(imagePath: string): Promise<BarcodeScannerResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<RNMLKitBarcodeScanningModule>(
  "RNMLKitBarcodeScanning"
);
