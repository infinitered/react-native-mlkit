import { createContext, useContext, useMemo } from "react";

import { RNMLKitObjectDetector } from "./types";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: RNMLKitObjectDetector;
};

export interface RNMLKitObjectDetectionContextValue<T extends ModelAssets> {
  models: Models<T>;
}

export const RNMLKitObjectDetectionContext = createContext<
  RNMLKitObjectDetectionContextValue<ModelAssets> | undefined
>(undefined);

export function useRNMLKitObjectDetectionContext<T extends ModelAssets>() {
  const context = useContext(RNMLKitObjectDetectionContext);
  if (!context) {
    throw new Error(
      "useRNMLKitObjectDetectionContext must be used within a <RNMLKitObjectDetectionContext.Provider>"
    );
  }
  return context as RNMLKitObjectDetectionContextValue<T>;
}

export function useObjectDetector(name: string = "default") {
  const { models } = useRNMLKitObjectDetectionContext<ModelAssets>();

  return useMemo(() => {
    return models[name];
  }, [models, models[name]]);
}
