import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoMLKitImageLabelerViewProps } from './ExpoMLKitImageLabeler.types';

const NativeView: React.ComponentType<ExpoMLKitImageLabelerViewProps> =
  requireNativeViewManager('ExpoMLKitImageLabeler');

export default function ExpoMLKitImageLabelerView(props: ExpoMLKitImageLabelerViewProps) {
  return <NativeView {...props} />;
}
