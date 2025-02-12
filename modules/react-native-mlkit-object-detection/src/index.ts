// index.ts
import RNMLKitObjectDetectionModule from "./module/RNMLKitObjectDetectionModule";
import {
  RNMLKitCustomObjectDetectorOptions,
  RNMLKitObjectDetectionObject,
} from "./types";

// Export all types
export type {
  RNMLKitObjectDetectionObject,
  RNMLKitLabel,
  RNMLKitObjectDetectorOptions,
  RNMLKitCustomObjectDetectorOptions,
  RNMLKitObjectDetector,
  ObjectDetectionModelInfo,
  ObjectDetectionConfig,
  ObjectDetectionModels,
} from "./types";

// Export context and hooks
export {
  ObjectDetectionContext,
  useObjectDetectionContext,
  type ObjectDetectionContextValue,
} from "./context/ObjectDetectionContext";

// Export main hooks
export { useObjectDetectionModels } from "./hooks/useObjectDetectionModels";
export { useObjectDetectionProvider } from "./hooks/useObjectDetectionProvider";
export { useObjectDetection } from "./hooks/useObjectDetection";

// Export detector classes
export { RNMLKitCustomObjectDetector } from "./module/RNMLKitCustomObjectDetector";
export { RNMLKitDefaultObjectDetector } from "./module/RNMLKitDefaultObjectDetector";

// Re-export core library types
export type {
  RNMLKitRect,
  RNMLKitPoint,
  ModelInfo,
  AssetRecord,
} from "@infinitered/react-native-mlkit-core";

// Expo Module API Functions
export async function loadCustomModel(
  name: string,
  modelPath: string,
  options?: RNMLKitCustomObjectDetectorOptions
) {
  return await RNMLKitObjectDetectionModule.loadCustomModel({
    modelName: name,
    modelPath,
    options,
  });
}

export async function loadDefaultModel(
  options?: RNMLKitCustomObjectDetectorOptions
) {
  return await RNMLKitObjectDetectionModule.loadDefaultModel(options);
}

export async function detectObjects(
  modelName: string,
  imagePath: string
): Promise<RNMLKitObjectDetectionObject[]> {
  return await RNMLKitObjectDetectionModule.detectObjects(modelName, imagePath);
}

export function isLoaded(modelName: string) {
  return RNMLKitObjectDetectionModule.isLoaded(modelName);
}
