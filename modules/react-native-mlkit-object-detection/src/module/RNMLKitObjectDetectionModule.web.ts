import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";
import {
  RNMLKitDetectedObject,
  RNMLKitObjectDetectionModule,
  RNMLKitObjectDetectorOptions,
  RNMLKitObjectDetectorSpec,
} from "../module/RNMLKitObjectDetectionModule";

export const module: RNMLKitObjectDetectionModule = {
  loadCustomModel(_spec: RNMLKitObjectDetectorSpec): Promise<string> {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
  loadDefaultModel(_options?: RNMLKitObjectDetectorOptions): Promise<boolean> {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
  detectObjects(
    _modelName: string,
    _imagePath: string
  ): Promise<RNMLKitDetectedObject[]> {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
  isLoaded(_modelName?: string): boolean {
    throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
  },
};
