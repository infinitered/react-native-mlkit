import {
  RNMLKitRect,
  ModelInfo,
  AssetRecord,
} from "@infinitered/react-native-mlkit-core";

export interface RNMLKitLabel {
  text: string;
  confidence: number;
  index: number;
}

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
  updateOptionsAndReload(options: RNMLKitObjectDetectorOptions): Promise<void>;
}

// This represents the configuration for a specific model
export type ObjectDetectionModelInfo =
  ModelInfo<RNMLKitCustomObjectDetectorOptions>;

// This represents all models in the configuration
export type ObjectDetectionAssetRecord =
  AssetRecord<RNMLKitCustomObjectDetectorOptions>;

// This represents the loaded model instances
export type ObjectDetectionModels<T extends ObjectDetectionAssetRecord> = {
  [K in keyof T | "default"]?: RNMLKitObjectDetector;
};
