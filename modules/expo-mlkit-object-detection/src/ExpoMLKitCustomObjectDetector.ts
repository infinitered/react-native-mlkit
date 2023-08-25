import ExpoMLKitObjectDetectionModule from "./ExpoMLKitObjectDetectionModule";
import {
  ExpoMLKitObjectDetectorOptions,
  ExpoMLKitObjectDetectionObject,
  ExpoMLKitObjectDetector,
} from "./types";

export class ExpoMLKitCustomObjectDetector implements ExpoMLKitObjectDetector {
  private modelName: string;
  private modelPath: string;
  private options?: ExpoMLKitObjectDetectorOptions;

  constructor(
    modelName: string,
    modelPath: string,
    options?: ExpoMLKitObjectDetectorOptions
  ) {
    this.modelName = modelName;
    this.modelPath = modelPath;
    this.options = options;
  }

  load(): Promise<void> {
    console.log(
      `ExpoMLKitCustomObjectDetector(${this.modelName}).load`,
      this.options
    );
    return ExpoMLKitObjectDetectionModule.loadCustomModel({
      modelName: this.modelName,
      modelPath: this.modelPath,
      options: this.options,
    });
  }

  isLoaded() {
    return ExpoMLKitObjectDetectionModule.isLoaded(this.modelName);
  }

  async detectObjects(
    imagePath: string
  ): Promise<ExpoMLKitObjectDetectionObject[]> {
    console.log(
      `ExpoMLKitCustomObjectDetector(${this.modelName}).detectObjects`
    );
    if (!this.isLoaded()) {
      throw new Error("Custom model is not loaded");
    }

    try {
      console.log(`trying to detect objects in ${imagePath}`);
      return await ExpoMLKitObjectDetectionModule.detectObjects(
        this.modelName,
        imagePath
      );
    } catch (err) {
      throw new Error(`Failed to detect objects: ${err.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: ExpoMLKitObjectDetectorOptions
  ): Promise<void> {
    this.options = newOptions;
    await this.load(); // Reloading the custom model with the new options
  }
}
