import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeMlkitBarcodeScanningViewProps } from './ReactNativeMlkitBarcodeScanning.types';

const NativeView: React.ComponentType<ReactNativeMlkitBarcodeScanningViewProps> =
  requireNativeView('ReactNativeMlkitBarcodeScanning');

export default function ReactNativeMlkitBarcodeScanningView(props: ReactNativeMlkitBarcodeScanningViewProps) {
  return <NativeView {...props} />;
}
