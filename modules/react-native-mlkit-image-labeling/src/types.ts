import { ModelInfo } from "@infinitered/react-native-mlkit-core";

import { RNMLKitClassifier } from "./module/RNMLKitClassifier";
import {
  RNMLKitCustomImageLabelerOptions,
  RNMLKitImageLabel,
} from "./module/RNMLKitImageLabeler";

export type ImageLabelingModelInfo =
  ModelInfo<RNMLKitCustomImageLabelerOptions>;

export type ImageLabelingConfig = Record<string, ImageLabelingModelInfo>;

export type ImageLabelingModels<T extends ImageLabelingConfig> = {
  [K in keyof T]: RNMLKitClassifier;
};

export type ClassificationStatus = "init" | "loading" | "success" | "error";

export type ImageSource = {
  uri?: string;
  localUri?: string;
};

export type ClassificationHookResult = {
  result?: RNMLKitImageLabel[];
  loading: boolean;
  error?: Error;
  modelName: string;
};
