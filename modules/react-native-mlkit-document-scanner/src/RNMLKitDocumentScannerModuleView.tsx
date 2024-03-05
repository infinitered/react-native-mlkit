import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { RNMLKitDocumentScannerModuleViewProps } from './RNMLKitDocumentScannerModule.types';

const NativeView: React.ComponentType<RNMLKitDocumentScannerModuleViewProps> =
  requireNativeViewManager('RNMLKitDocumentScannerModule');

export default function RNMLKitDocumentScannerModuleView(props: RNMLKitDocumentScannerModuleViewProps) {
  return <NativeView {...props} />;
}
