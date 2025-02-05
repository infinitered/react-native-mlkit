// index.ts
import RNMLKitObjectDetectionModule from "./RNMLKitObjectDetectionModule";
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
  ObjectDetectionAssetRecord,
  ObjectDetectionModels,
} from "./types";

// Export context and hooks
export {
  ObjectDetectionContext,
  useObjectDetectionContext,
  type ObjectDetectionContextValue,
} from "./RNMLKitObjectDetectionContext";

// Export main hooks
export { useObjectDetectionModels } from "./useObjectDetectionModels";
export { useObjectDetectionProvider } from "./useObjectDetectionProvider";
export { useObjectDetector } from "./useObjectDetector";

// Export detector classes
export { RNMLKitCustomObjectDetector } from "./RNMLKitCustomObjectDetector";
export { RNMLKitDefaultObjectDetector } from "./RNMLKitDefaultObjectDetector";

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
