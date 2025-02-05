// index.ts
import RNMLKitObjectDetectionModule from "./RNMLKitObjectDetectionModule";
import { CustomObjectDetectorOptions, ObjectDetectionObject } from "./types";

// Export all types
export type {
  ObjectDetectionObject,
  RNMLKitLabel,
  ObjectDetectorOptions,
  CustomObjectDetectorOptions,
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
} from "./ObjectDetectionContext";

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
  options?: CustomObjectDetectorOptions
) {
  return await RNMLKitObjectDetectionModule.loadCustomModel({
    modelName: name,
    modelPath,
    options,
  });
}

export async function loadDefaultModel(options?: CustomObjectDetectorOptions) {
  return await RNMLKitObjectDetectionModule.loadDefaultModel(options);
}

export async function detectObjects(
  modelName: string,
  imagePath: string
): Promise<ObjectDetectionObject[]> {
  return await RNMLKitObjectDetectionModule.detectObjects(modelName, imagePath);
}

export function isLoaded(modelName: string) {
  return RNMLKitObjectDetectionModule.isLoaded(modelName);
}
