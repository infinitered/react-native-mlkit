import {
  RNMLKitDetectedObject,
  RNMLKitObjectDetectionModule,
  RNMLKitObjectDetectorOptions,
  RNMLKitObjectDetectorSpec,
} from "./RNMLKitObjectDetectionModule";

const webError = new Error(
  "RNMLKitObjectDetectionModule is not supported on web"
);

export const module: RNMLKitObjectDetectionModule = {
  loadCustomModel(_spec: RNMLKitObjectDetectorSpec): Promise<string> {
    throw webError;
  },
  loadDefaultModel(_options?: RNMLKitObjectDetectorOptions): Promise<boolean> {
    throw webError;
  },
  detectObjects(
    _modelName: string,
    _imagePath: string
  ): Promise<RNMLKitDetectedObject[]> {
    throw webError;
  },
  isLoaded(_modelName?: string): boolean {
    throw webError;
  },
};
