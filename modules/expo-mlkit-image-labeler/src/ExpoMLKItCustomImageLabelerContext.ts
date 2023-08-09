import { createContext, useContext } from "react";
import { ExpoMLKitClassifier } from "./ExpoMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: ExpoMLKitClassifier;
};

export interface ExpoMLKitCustomImageLabelerContextValue<
  T extends ModelAssets
> {
  models: Models<T>;
}

export const ExpoMLKitCustomImageLabelerContext = createContext<
  ExpoMLKitCustomImageLabelerContextValue<ModelAssets> | undefined
>(undefined);

export function useExpoMLKitCustomImageLabelerContext<T extends ModelAssets>() {
  const context = useContext(ExpoMLKitCustomImageLabelerContext);
  if (!context) {
    throw new Error(
      "useExpoMLKitCustomImageLabelerContext must be used within a <ExpoMLKitCustomImageLabelerContext.Provider>"
    );
  }
  return context as ExpoMLKitCustomImageLabelerContextValue<T>;
}
