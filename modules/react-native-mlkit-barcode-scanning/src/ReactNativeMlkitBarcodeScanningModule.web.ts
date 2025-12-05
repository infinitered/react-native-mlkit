import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ReactNativeMlkitBarcodeScanning.types';

type ReactNativeMlkitBarcodeScanningModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ReactNativeMlkitBarcodeScanningModule extends NativeModule<ReactNativeMlkitBarcodeScanningModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ReactNativeMlkitBarcodeScanningModule, 'ReactNativeMlkitBarcodeScanningModule');
