import { ExpoMLKitRect } from "@infinitered/expo-mlkit-core";
import { requireNativeModule } from "expo-modules-core";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export default requireNativeModule("ExpoMLKitObjectDetection");

export interface ExpoMLKitObjectDetectionModule {
  loadCustomModel(spec: ExpoMLKitObjectDetectorSpec): Promise<string>;
  loadDefaultModel(options?: ExpoMLKitObjectDetectorOptions): Promise<boolean>;
  detectObjects(
    modelName: string,
    imagePath: string
  ): Promise<ExpoMLKitDetectedObject[]>;
  isLoaded(modelName?: string): boolean;
}

export interface ExpoMLKitObjectDetectorSpec {
  modelName: string;
  modelPath: string;
  options?: ExpoMLKitObjectDetectorOptions;
}

export interface ExpoMLKitObjectDetectorOptions {
  shouldEnableClassification?: boolean;
  shouldEnableMultipleObjects?: boolean;
  detectorMode?: string;
  classificationConfidenceThreshold?: number;
  maxPerObjectLabelCount?: number;
}

export interface ExpoMLKitDetectedObject {
  boundingBox: ExpoMLKitRect;
  labels: ExpoMLKitLabel[];
  trackingId?: number;
}

export interface ExpoMLKitLabel {
  text: string;
  confidence: number;
  index: number;
}
