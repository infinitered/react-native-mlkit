import { useObjectDetectionContext } from "./RNMLKitObjectDetectionContext";
import { ObjectDetectionAssetRecord, RNMLKitObjectDetector } from "./types";

export function useObjectDetector<T extends ObjectDetectionAssetRecord>(
  modelName: keyof T | "default"
): RNMLKitObjectDetector | undefined {
  const context = useObjectDetectionContext<T>();
  return context[modelName];
}
