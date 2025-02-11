import { requireNativeModule } from "expo";
import { UnavailabilityError } from "expo-modules-core";

import { RNMLKIT_MODULE_NAME } from "../constants";

const WEB_ERROR = "Method not available on web";

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

function loadModel(
  modelSpec: RNMLKitImageLabelerSpec
): Promise<string | undefined> {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}

function isLoaded(modelName: string): boolean {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}

async function classifyImage(
  modelName: string,
  imagePath: string
): Promise<ClassificationResult> {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}

async function updateOptionsAndReload(
  modelName: string,
  newOptions: RNMLKitCustomImageLabelerOptions
): Promise<void> {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}

export default { loadModel, classifyImage, updateOptionsAndReload, isLoaded };
