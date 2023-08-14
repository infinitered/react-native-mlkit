import { useContext } from "react";

import { ExpoMLKitImageLabelerContext } from "./expoMLKitImageLabelerContext";

export function useImageLabeler(modelName: string) {
  const modelContext = useContext(ExpoMLKitImageLabelerContext);

  if (!modelContext) {
    throw new Error(
      "useCustomImageLabeler must be used within a <ExpoMLKitCustomImageLabelerContext.Provider>"
    );
  }

  const { models } = modelContext;

  return models[modelName];
}
