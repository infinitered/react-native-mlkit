import { RNMLKitRect } from "@infinitered/react-native-mlkit-core";

import { RNMLKitLabel } from "./RNMLKitObjectDetectionModule";

export interface RNMLKitObjectDetectionObject {
  frame: RNMLKitRect;
  labels: RNMLKitLabel[];
  trackingID?: number;
}

export interface RNMLKitObjectDetectorOptions {
  shouldEnableClassification?: boolean;
  shouldEnableMultipleObjects?: boolean;
  detectorMode?: "singleImage" | "stream";
}

export interface RNMLKitCustomObjectDetectorOptions
  extends RNMLKitObjectDetectorOptions {
  classificationConfidenceThreshold?: number;
  maxPerObjectLabelCount?: number;
}

export interface RNMLKitObjectDetector {
  load(): Promise<void>;
  isLoaded(): boolean;
  detectObjects(imagePath: string): Promise<RNMLKitObjectDetectionObject[]>;
  updateOptionsAndReload(
    newOptions: RNMLKitObjectDetectorOptions
  ): Promise<void>;
}
