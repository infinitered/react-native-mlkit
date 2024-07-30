import RNMLKitObjectDetectionModule from "./RNMLKitObjectDetectionModule";
import {
  RNMLKitObjectDetectorOptions,
  RNMLKitObjectDetectionObject,
  RNMLKitObjectDetector,
} from "./types";

export class RNMLKitCustomObjectDetector implements RNMLKitObjectDetector {
  private modelName: string;
  private modelPath: string;
  private options?: RNMLKitObjectDetectorOptions;

  constructor(
    modelName: string,
    modelPath: string,
    options?: RNMLKitObjectDetectorOptions
  ) {
    this.modelName = modelName;
    this.modelPath = modelPath;
    this.options = options;
  }

  load(): Promise<void> {
    return RNMLKitObjectDetectionModule.loadCustomModel({
      modelName: this.modelName,
      modelPath: this.modelPath,
      options: this.options,
    });
  }

  isLoaded() {
    return RNMLKitObjectDetectionModule.isLoaded(this.modelName);
  }

  async detectObjects(
    imagePath: string
  ): Promise<RNMLKitObjectDetectionObject[]> {
    if (!this.isLoaded()) {
      throw new Error("Custom model is not loaded");
    }

    try {
      return await RNMLKitObjectDetectionModule.detectObjects(
        this.modelName,
        imagePath
      );
    } catch (err: any) {
      throw new Error(`Failed to detect objects: ${err.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: RNMLKitObjectDetectorOptions
  ): Promise<void> {
    this.options = newOptions;
    await this.load(); // Reloading the custom model with the new options
  }
}
