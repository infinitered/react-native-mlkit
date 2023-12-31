import { createContext, useContext } from "react";

import { RNMLKitClassifier } from "./RNMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: RNMLKitClassifier;
};

export interface RNMLKitImageLabelerContextValue<T extends ModelAssets> {
  models: Models<T>;
}

export const RNMLKitImageLabelerContext = createContext<
  RNMLKitImageLabelerContextValue<ModelAssets> | undefined
>(undefined);

export function useRNMLKitImageLabelerContext<T extends ModelAssets>() {
  const context = useContext(RNMLKitImageLabelerContext);
  if (!context) {
    throw new Error(
      "useRNMLKitImageLabelerContext must be used within a <RNMLKitImageLabelerContext.Provider>"
    );
  }
  return context as RNMLKitImageLabelerContextValue<T>;
}
