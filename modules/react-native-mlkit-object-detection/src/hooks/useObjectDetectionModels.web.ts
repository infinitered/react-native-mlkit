import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";
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
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}
