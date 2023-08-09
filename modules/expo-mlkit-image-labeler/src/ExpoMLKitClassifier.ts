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
    // Call the native method with the modelName as an extra parameter
    return ExpoMLKitImageLabeler.classifyImage(
      this.modelSpec.modelName,
      imagePath
    );
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

  // You can add more methods that correspond to your native API...
}
