import ExpoMLKitObjectDetectionModule from "./ExpoMLKitObjectDetectionModule";
import {
  ExpoMLKitObjectDetectionObject,
  ExpoMLKitObjectDetectorOptions,
  ExpoMLKitObjectDetector,
} from "./types";

export class ExpoMLKitDefaultObjectDetector implements ExpoMLKitObjectDetector {
  private options?: ExpoMLKitObjectDetectorOptions;

  constructor(options?: ExpoMLKitObjectDetectorOptions) {
    this.options = options;
  }

  load(): Promise<void> {
    return ExpoMLKitObjectDetectionModule.loadDefaultModel(this.options);
  }

  isLoaded() {
    return ExpoMLKitObjectDetectionModule.isLoaded("default");
  }

  async detectObjects(
    imagePath: string
  ): Promise<ExpoMLKitObjectDetectionObject[]> {
    if (!this.isLoaded()) {
      throw new Error("Default model is not loaded");
    }

    try {
      return ExpoMLKitObjectDetectionModule.detectObjects("default", imagePath);
    } catch (err) {
      throw new Error(`Failed to detect objects: ${err.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: ExpoMLKitObjectDetectorOptions
  ): Promise<void> {
    this.options = newOptions;
    await this.load(); // Reloading the default model with the new options
  }
}
