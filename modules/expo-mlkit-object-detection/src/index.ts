import ExpoMLKitObjectDetectionModule from "./ExpoMLKitObjectDetectionModule";
import {
  ExpoMLKitCustomObjectDetectorOptions,
  ExpoMLKitObjectDetectionObject,
} from "./types";

export * from "./types";
export * from "./useObjectDetectionModels";
export * from "./expoMLKitObjectDetectionContext";

export async function loadCustomModel(
  name: string,
  modelPath: string,
  options?: ExpoMLKitCustomObjectDetectorOptions
) {
  return await ExpoMLKitObjectDetectionModule.loadCustomModel(
    name,
    modelPath,
    options
  );
}

export async function loadDefaultModel(
  options?: ExpoMLKitCustomObjectDetectorOptions // You may need to define a specific type for default options if
  // different from custom options
) {
  return await ExpoMLKitObjectDetectionModule.loadDefaultModel(options);
}

export async function detectObjects(
  modelName: string,
  imagePath: string
): Promise<ExpoMLKitObjectDetectionObject[]> {
  return await ExpoMLKitObjectDetectionModule.detectObjects(
    modelName,
    imagePath
  );
}

export function isLoaded(modelName: string) {
  return ExpoMLKitObjectDetectionModule.isLoaded(modelName);
}
