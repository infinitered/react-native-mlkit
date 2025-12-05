import { NativeModule, requireNativeModule } from 'expo';

import { BarcodeScannerResult } from './ReactNativeMlkitBarcodeScanning.types';

declare class ReactNativeMlkitBarcodeScanningModule extends NativeModule {
  process(imagePath: string): Promise<BarcodeScannerResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeMlkitBarcodeScanningModule>('ReactNativeMlkitBarcodeScanning');
