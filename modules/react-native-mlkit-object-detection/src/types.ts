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

export interface ObjectDetectionObject {
  frame: RNMLKitRect;
  labels: RNMLKitLabel[];
  trackingID?: number;
}

export interface ObjectDetectorOptions {
  shouldEnableClassification?: boolean;
  shouldEnableMultipleObjects?: boolean;
  detectorMode?: "singleImage" | "stream";
}

export interface CustomObjectDetectorOptions extends ObjectDetectorOptions {
  classificationConfidenceThreshold?: number;
  maxPerObjectLabelCount?: number;
}

export interface RNMLKitObjectDetector {
  load(): Promise<void>;
  isLoaded(): boolean;
  detectObjects(imagePath: string): Promise<ObjectDetectionObject[]>;
  updateOptionsAndReload(options: ObjectDetectorOptions): Promise<void>;
}

// This represents the configuration for a specific model
export type ObjectDetectionModelInfo = ModelInfo<CustomObjectDetectorOptions>;

// This represents all models in the configuration
export type ObjectDetectionConfig = AssetRecord<CustomObjectDetectorOptions>;

// This represents the loaded model instances
export type ObjectDetectionModels<T extends ObjectDetectionConfig> = {
  [K in keyof T | "default"]?: RNMLKitObjectDetector;
};
