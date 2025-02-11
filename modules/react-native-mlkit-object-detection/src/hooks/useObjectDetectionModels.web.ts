import { WEB_ERROR } from "../constants";
import {
  RNMLKitObjectDetectorOptions,
  ObjectDetectionModels,
  ObjectDetectionConfig,
} from "../types";

export function useObjectDetectionModels<T extends ObjectDetectionConfig>({
  assets = {} as T,
  loadDefaultModel,
  defaultModelOptions,
}: {
  assets?: T;
  loadDefaultModel?: boolean;
  defaultModelOptions?: RNMLKitObjectDetectorOptions;
}): ObjectDetectionModels<T> {
  throw new Error(WEB_ERROR);
}
