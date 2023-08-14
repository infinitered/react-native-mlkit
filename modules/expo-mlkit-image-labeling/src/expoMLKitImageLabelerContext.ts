import { createContext, useContext } from "react";

import { ExpoMLKitClassifier } from "./ExpoMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: ExpoMLKitClassifier;
};

export interface ExpoMLKitImageLabelerContextValue<T extends ModelAssets> {
  models: Models<T>;
}

export const ExpoMLKitImageLabelerContext = createContext<
  ExpoMLKitImageLabelerContextValue<ModelAssets> | undefined
>(undefined);

export function useExpoMLKitImageLabelerContext<T extends ModelAssets>() {
  const context = useContext(ExpoMLKitImageLabelerContext);
  if (!context) {
    throw new Error(
      "useExpoMLKitImageLabelerContext must be used within a <ExpoMLKitImageLabelerContext.Provider>"
    );
  }
  return context as ExpoMLKitImageLabelerContextValue<T>;
}
