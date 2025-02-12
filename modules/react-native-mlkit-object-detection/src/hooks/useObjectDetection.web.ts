import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";
import { ObjectDetectionConfig, RNMLKitObjectDetector } from "../types";

export function useObjectDetection<T extends ObjectDetectionConfig>(
  modelName: keyof T | "default"
): RNMLKitObjectDetector | undefined {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}
