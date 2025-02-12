import { requireNativeModule } from "expo-modules-core";

export type RNMLKitImageLabel = {
  text: string;
  index: number;
  confidence: number;
};

export type ClassificationResult = RNMLKitImageLabel[];

export type RNMLKitCustomImageLabelerOptions = {
  maxResultCount?: number;
  confidenceThreshold?: number;
};

export type RNMLKitImageLabelerSpec = {
  modelName: string;
  modelPath: string;
  options?: RNMLKitCustomImageLabelerOptions;
};

type RNMLKitImageLabelingModule = {
  addModel: (modelSpec: RNMLKitImageLabelerSpec) => Promise<string | undefined>;
  loadModel: (
    modelSpec: RNMLKitImageLabelerSpec
  ) => Promise<string | undefined>;
  isLoaded: (modelName: string) => boolean;
  runClassification: (imagePath: string) => Promise<ClassificationResult>;
  classifyImage: (
    modelName: string,
    imagePath: string
  ) => Promise<ClassificationResult>;
  updateOptionsAndReload: (
    modelName: string,
    newOptions: RNMLKitCustomImageLabelerOptions
  ) => Promise<void>;
};

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const imageLabelingModule = requireNativeModule(
  "RNMLKitImageLabeling"
) as RNMLKitImageLabelingModule;

function loadModel(
  modelSpec: RNMLKitImageLabelerSpec
): Promise<string | undefined> {
  try {
    return imageLabelingModule.addModel(modelSpec);
  } catch (error) {
    console.error("Failed to load model: ", error);
    return Promise.resolve(undefined);
  }
}

function isLoaded(modelName: string): boolean {
  return imageLabelingModule.isLoaded(modelName);
}

async function classifyImage(
  modelName: string,
  imagePath: string
): Promise<ClassificationResult> {
  return await imageLabelingModule.classifyImage(modelName, imagePath);
}

async function updateOptionsAndReload(
  modelName: string,
  newOptions: RNMLKitCustomImageLabelerOptions
): Promise<void> {
  return await imageLabelingModule.updateOptionsAndReload(
    modelName,
    newOptions
  );
}

export default { loadModel, classifyImage, updateOptionsAndReload, isLoaded };
