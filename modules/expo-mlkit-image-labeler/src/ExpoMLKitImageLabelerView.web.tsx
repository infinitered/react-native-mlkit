import * as React from 'react';

import { ExpoMLKitImageLabelerViewProps } from './ExpoMLKitImageLabeler.types';

export default function ExpoMLKitImageLabelerView(props: ExpoMLKitImageLabelerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
