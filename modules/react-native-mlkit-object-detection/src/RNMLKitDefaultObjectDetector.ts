import RNMLKitObjectDetectionModule from "./RNMLKitObjectDetectionModule";
import {
  ObjectDetectionObject,
  ObjectDetectorOptions,
  RNMLKitObjectDetector,
} from "./types";

export class RNMLKitDefaultObjectDetector implements RNMLKitObjectDetector {
  private options?: ObjectDetectorOptions;

  constructor(options?: ObjectDetectorOptions) {
    this.options = options;
  }

  load(): Promise<void> {
    return RNMLKitObjectDetectionModule.loadDefaultModel(this.options);
  }

  isLoaded() {
    return RNMLKitObjectDetectionModule.isLoaded("default");
  }

  async detectObjects(imagePath: string): Promise<ObjectDetectionObject[]> {
    if (!this.isLoaded()) {
      throw new Error("Default model is not loaded");
    }

    try {
      return RNMLKitObjectDetectionModule.detectObjects("default", imagePath);
    } catch (err: any) {
      throw new Error(`Failed to detect objects: ${err?.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: ObjectDetectorOptions
  ): Promise<void> {
    this.options = newOptions;
    await this.load(); // Reloading the default model with the new options
  }
}
