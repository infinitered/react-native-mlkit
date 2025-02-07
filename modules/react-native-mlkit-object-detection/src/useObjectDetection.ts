import { useObjectDetectionContext } from "./ObjectDetectionContext";
import { ObjectDetectionConfig, RNMLKitObjectDetector } from "./types";

export function useObjectDetection<T extends ObjectDetectionConfig>(
  modelName: keyof T | "default"
): RNMLKitObjectDetector | undefined {
  const context = useObjectDetectionContext<T>();
  return context[modelName];
}
