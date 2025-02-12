import { createContext, useContext } from "react";

import { RNMLKitClassifier } from "../module/RNMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: RNMLKitClassifier;
};

export const ImageLabelingContext = createContext<
  Models<ModelAssets> | undefined
>(undefined);

export function useRNMLKitImageLabelerContext<T extends ModelAssets>() {
  const context = useContext(ImageLabelingContext);
  if (!context) {
    throw new Error(
      "useRNMLKitImageLabelerContext must be used within a <ImageLabelingContext.Provider>"
    );
  }
  return context as Models<T>;
}
