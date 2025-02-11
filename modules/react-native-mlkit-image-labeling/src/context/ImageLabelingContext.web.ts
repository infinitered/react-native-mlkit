import { createContext } from "react";

import { RNMLKitClassifier } from "../module/RNMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: RNMLKitClassifier;
};

export const ImageLabelingContext = createContext<
  Models<ModelAssets> | undefined
>(undefined);

export function useRNMLKitImageLabelerContext() {
  throw new Error("WEB_ERROR");
}
