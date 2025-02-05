import RNMLKitImageLabeler, {
  ClassificationResult,
  CustomImageLabelerOptions,
  ImageLabelerSpec,
} from "./RNMLKitImageLabeler";

export class RNMLKitClassifier {
  private modelSpec: ImageLabelerSpec;

  constructor(modelSpec: ImageLabelerSpec) {
    this.modelSpec = modelSpec;
  }

  load(): Promise<string | undefined> {
    return RNMLKitImageLabeler.loadModel(this.modelSpec);
  }

  isLoaded() {
    return RNMLKitImageLabeler.isLoaded(this.modelSpec.modelName);
  }

  async classifyImage(imagePath: string): Promise<ClassificationResult> {
    // Perform a check if the model is loaded
    if (!this.isLoaded()) {
      throw new Error("Model is not loaded");
    }

    try {
      // Call the native method with the modelName as an extra parameter
      return RNMLKitImageLabeler.classifyImage(
        this.modelSpec.modelName,
        imagePath
      );
    } catch (err: any) {
      // Handle specific errors as needed, or rethrow them
      throw new Error(`Failed to classify image: ${err.message}`);
    }
  }

  async updateOptionsAndReload(
    newOptions: CustomImageLabelerOptions
  ): Promise<void> {
    this.modelSpec = { ...this.modelSpec, options: newOptions };
    // Call the native method to update options and reload the model
    await RNMLKitImageLabeler.updateOptionsAndReload(
      this.modelSpec.modelName,
      newOptions
    );
  }
}
