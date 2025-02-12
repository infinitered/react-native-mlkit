import RNMLKitImageLabelingModule from "./module/RNMLKitImageLabeler";

export default RNMLKitImageLabelingModule;
export { useImageLabeling } from "./hooks/useImageLabeling";
export { useImageLabelingProvider } from "./hooks/useImageLabelingProvider";
export { useImageLabelingModels } from "./hooks/useImageLabelingModels";
export * from "./types";

export type { ClassificationResult } from "./module/RNMLKitImageLabeler";
