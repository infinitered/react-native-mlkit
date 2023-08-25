import { ExpoMLKitRect } from "@infinitered/expo-mlkit-core";

import { ExpoMLKitLabel } from "./ExpoMLKitObjectDetectionModule";

export interface ExpoMLKitObjectDetectionObject {
  frame: ExpoMLKitRect;
  labels: ExpoMLKitLabel[];
  trackingID?: number;
}

export interface ExpoMLKitObjectDetectorOptions {
  shouldEnableClassification?: boolean;
  shouldEnableMultipleObjects?: boolean;
  detectorMode?: "singleImage" | "stream";
}

export interface ExpoMLKitCustomObjectDetectorOptions
  extends ExpoMLKitObjectDetectorOptions {
  classificationConfidenceThreshold?: number;
  maxPerObjectLabelCount?: number;
}

export interface ExpoMLKitObjectDetector {
  load(): Promise<void>;
  isLoaded(): boolean;
  detectObjects(imagePath: string): Promise<ExpoMLKitObjectDetectionObject[]>;
  updateOptionsAndReload(
    newOptions: ExpoMLKitObjectDetectorOptions
  ): Promise<void>;
}
