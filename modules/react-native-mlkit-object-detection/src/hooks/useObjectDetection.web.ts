import { WEB_ERROR } from "../constants";
import { ObjectDetectionConfig, RNMLKitObjectDetector } from "../types";

export function useObjectDetection<T extends ObjectDetectionConfig>(
  modelName: keyof T | "default"
): RNMLKitObjectDetector | undefined {
  throw new Error(WEB_ERROR);
}
