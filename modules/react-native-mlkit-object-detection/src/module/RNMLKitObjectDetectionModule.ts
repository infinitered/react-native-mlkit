import { RNMLKitRect } from "@infinitered/react-native-mlkit-core";
import { requireNativeModule } from "expo-modules-core";

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
export default requireNativeModule("RNMLKitObjectDetection");

export interface RNMLKitObjectDetectionModule {
  loadCustomModel(spec: RNMLKitObjectDetectorSpec): Promise<string>;
  loadDefaultModel(options?: RNMLKitObjectDetectorOptions): Promise<boolean>;
  detectObjects(
    modelName: string,
    imagePath: string
  ): Promise<RNMLKitDetectedObject[]>;
  isLoaded(modelName?: string): boolean;
}

export interface RNMLKitObjectDetectorSpec {
  modelName: string;
  modelPath: string;
  options?: RNMLKitObjectDetectorOptions;
}

export interface RNMLKitObjectDetectorOptions {
  shouldEnableClassification?: boolean;
  shouldEnableMultipleObjects?: boolean;
  detectorMode?: string;
  classificationConfidenceThreshold?: number;
  maxPerObjectLabelCount?: number;
}

export interface RNMLKitDetectedObject {
  boundingBox: RNMLKitRect;
  labels: RNMLKitLabel[];
  trackingId?: number;
}

export interface RNMLKitLabel {
  text: string;
  confidence: number;
  index: number;
}
