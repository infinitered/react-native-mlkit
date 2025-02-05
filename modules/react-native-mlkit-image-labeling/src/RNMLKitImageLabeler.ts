import { requireNativeModule } from "expo-modules-core";

export type RNMLKitImageLabel = {
  text: string;
  index: number;
  confidence: number;
};

export type ClassificationResult = RNMLKitImageLabel[];

export type CustomImageLabelerOptions = {
  maxResultCount?: number;
  confidenceThreshold?: number;
};

export type ImageLabelerSpec = {
  modelName: string;
  modelPath: string;
  options?: CustomImageLabelerOptions;
};

type ImageLabelingModule = {
  addModel: (modelSpec: ImageLabelerSpec) => Promise<string | undefined>;
  loadModel: (modelSpec: ImageLabelerSpec) => Promise<string | undefined>;
  isLoaded: (modelName: string) => boolean;
  runClassification: (imagePath: string) => Promise<ClassificationResult>;
  classifyImage: (
    modelName: string,
    imagePath: string
  ) => Promise<ClassificationResult>;
  updateOptionsAndReload: (
    modelName: string,
    newOptions: CustomImageLabelerOptions
  ) => Promise<void>;
};

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const imageLabelingModule = requireNativeModule(
  "RNMLKitImageLabeling"
) as ImageLabelingModule;

function loadModel(modelSpec: ImageLabelerSpec): Promise<string | undefined> {
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
  newOptions: CustomImageLabelerOptions
): Promise<void> {
  return await imageLabelingModule.updateOptionsAndReload(
    modelName,
    newOptions
  );
}

export default { loadModel, classifyImage, updateOptionsAndReload, isLoaded };
