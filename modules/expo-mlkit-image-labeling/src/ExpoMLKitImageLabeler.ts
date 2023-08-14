import { requireNativeModule } from "expo-modules-core";

export type ExpoMLKitImageLabel = {
  text: string;
  index: number;
  confidence: number;
};

export type ClassificationResult = ExpoMLKitImageLabel[];

export type ExpoMLKitCustomImageLabelerOptions = {
  maxResultCount?: number;
  confidenceThreshold?: number;
};

export type ExpoMLKitImageLabelerSpec = {
  modelName: string;
  modelPath: string;
  options?: ExpoMLKitCustomImageLabelerOptions;
};

type ExpoMLKitImageLabelingModule = {
  addModel: (
    modelSpec: ExpoMLKitImageLabelerSpec
  ) => Promise<string | undefined>;
  loadModel: (
    modelSpec: ExpoMLKitImageLabelerSpec
  ) => Promise<string | undefined>;
  isLoaded: (modelName: string) => boolean;
  runClassification: (imagePath: string) => Promise<ClassificationResult>;
  classifyImage: (
    modelName: string,
    imagePath: string
  ) => Promise<ClassificationResult>;
  updateOptionsAndReload: (
    modelName: string,
    newOptions: ExpoMLKitCustomImageLabelerOptions
  ) => Promise<void>;
};

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const expoMLKitImageLabeler = requireNativeModule(
  "ExpoMLKitImageLabeling"
) as ExpoMLKitImageLabelingModule;

function loadModel(
  modelSpec: ExpoMLKitImageLabelerSpec
): Promise<string | undefined> {
  console.log("Loading Model: ", modelSpec);

  try {
    return expoMLKitImageLabeler.addModel(modelSpec);
  } catch (error) {
    console.error("Failed to load model: ", error);
    return Promise.resolve(undefined);
  }
}

function isLoaded(modelName: string): boolean {
  return expoMLKitImageLabeler.isLoaded(modelName);
}

async function classifyImage(
  modelName: string,
  imagePath: string
): Promise<ClassificationResult> {
  return await expoMLKitImageLabeler.classifyImage(modelName, imagePath);
}

async function updateOptionsAndReload(
  modelName: string,
  newOptions: ExpoMLKitCustomImageLabelerOptions
): Promise<void> {
  return await expoMLKitImageLabeler.updateOptionsAndReload(
    modelName,
    newOptions
  );
}

export default { loadModel, classifyImage, updateOptionsAndReload, isLoaded };
