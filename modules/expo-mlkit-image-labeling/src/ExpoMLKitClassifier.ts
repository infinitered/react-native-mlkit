import ExpoMLKitImageLabeler, {
  ClassificationResult,
  ExpoMLKitCustomImageLabelerOptions,
  ExpoMLKitImageLabelerSpec,
} from "./ExpoMLKitImageLabeler";

export class ExpoMLKitClassifier {
  private modelSpec: ExpoMLKitImageLabelerSpec;

  constructor(modelSpec: ExpoMLKitImageLabelerSpec) {
    console.log("ExpoMLKitClassifier - constructor", modelSpec);
    this.modelSpec = modelSpec;
  }

  load(): Promise<string | undefined> {
    return ExpoMLKitImageLabeler.loadModel(this.modelSpec);
  }

  isLoaded() {
    return ExpoMLKitImageLabeler.isLoaded(this.modelSpec.modelName);
  }

  async classifyImage(imagePath: string): Promise<ClassificationResult> {
    // Perform a check if the model is loaded
    if (!this.isLoaded()) {
      throw new Error("Model is not loaded");
    }

    try {
      // Call the native method with the modelName as an extra parameter
      return ExpoMLKitImageLabeler.classifyImage(
        this.modelSpec.modelName,
        imagePath
      );
    } catch (err) {
      // Handle specific errors as needed, or rethrow them
      throw new Error(`Failed to classify image: ${err.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: ExpoMLKitCustomImageLabelerOptions
  ): Promise<void> {
    this.modelSpec = { ...this.modelSpec, options: newOptions };
    // Call the native method to update options and reload the model
    await ExpoMLKitImageLabeler.updateOptionsAndReload(
      this.modelSpec.modelName,
      newOptions
    );
  }
}
