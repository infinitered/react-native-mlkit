import { createContext, useContext, useMemo } from "react";

import { ExpoMLKitObjectDetector } from "./types";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: ExpoMLKitObjectDetector;
};

export interface ExpoMLKitObjectDetectionContextValue<T extends ModelAssets> {
  models: Models<T>;
}

export const ExpoMLKitObjectDetectionContext = createContext<
  ExpoMLKitObjectDetectionContextValue<ModelAssets> | undefined
>(undefined);

export function useExpoMLKitObjectDetectionContext<T extends ModelAssets>() {
  const context = useContext(ExpoMLKitObjectDetectionContext);
  if (!context) {
    throw new Error(
      "useExpoMLKitObjectDetectionContext must be used within a <ExpoMLKitObjectDetectionContext.Provider>"
    );
  }
  return context as ExpoMLKitObjectDetectionContextValue<T>;
}

export function useObjectDetector(name: string = "default") {
  const { models } = useExpoMLKitObjectDetectionContext<ModelAssets>();

  const model = useMemo(() => {
    return models[name];
  }, [models, models[name]]);

  return models[name];
}
