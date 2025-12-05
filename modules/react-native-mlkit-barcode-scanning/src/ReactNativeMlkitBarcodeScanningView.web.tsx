import * as React from 'react';

import { ReactNativeMlkitBarcodeScanningViewProps } from './ReactNativeMlkitBarcodeScanning.types';

export default function ReactNativeMlkitBarcodeScanningView(props: ReactNativeMlkitBarcodeScanningViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
