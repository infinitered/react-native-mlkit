import { WEB_ERROR } from "../constants";
import {
  RNMLKitDetectedObject,
  RNMLKitObjectDetectionModule,
  RNMLKitObjectDetectorOptions,
  RNMLKitObjectDetectorSpec,
} from "../module/RNMLKitObjectDetectionModule";

export const module: RNMLKitObjectDetectionModule = {
  loadCustomModel(_spec: RNMLKitObjectDetectorSpec): Promise<string> {
    throw new Error(WEB_ERROR);
  },
  loadDefaultModel(_options?: RNMLKitObjectDetectorOptions): Promise<boolean> {
    throw new Error(WEB_ERROR);
  },
  detectObjects(
    _modelName: string,
    _imagePath: string
  ): Promise<RNMLKitDetectedObject[]> {
    throw new Error(WEB_ERROR);
  },
  isLoaded(_modelName?: string): boolean {
    throw new Error(WEB_ERROR);
  },
};
