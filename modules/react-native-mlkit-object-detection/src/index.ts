import RNMLKitObjectDetectionModule from "./RNMLKitObjectDetectionModule";
import {
  RNMLKitCustomObjectDetectorOptions,
  RNMLKitObjectDetectionObject,
} from "./types";

export * from "./types";
export * from "./useObjectDetectionModels";
export * from "./expoMLKitObjectDetectionContext";

export async function loadCustomModel(
  name: string,
  modelPath: string,
  options?: RNMLKitCustomObjectDetectorOptions
) {
  return await RNMLKitObjectDetectionModule.loadCustomModel(
    name,
    modelPath,
    options
  );
}

export async function loadDefaultModel(
  options?: RNMLKitCustomObjectDetectorOptions // You may need to define a specific type for default options if
  // different from custom options
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
