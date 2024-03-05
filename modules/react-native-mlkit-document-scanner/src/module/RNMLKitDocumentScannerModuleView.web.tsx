import * as React from 'react';

import { RNMLKitDocumentScannerModuleViewProps } from './RNMLKitDocumentScannerModule.types';

export default function RNMLKitDocumentScannerModuleView(props: RNMLKitDocumentScannerModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
