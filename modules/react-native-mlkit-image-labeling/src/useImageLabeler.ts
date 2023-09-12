import { useContext } from "react";

import { RNMLKitImageLabelerContext } from "./expoMLKitImageLabelerContext";

export function useImageLabeler(modelName: string) {
  const modelContext = useContext(RNMLKitImageLabelerContext);

  if (!modelContext) {
    throw new Error(
      "useCustomImageLabeler must be used within a <RNMLKitCustomImageLabelerContext.Provider>"
    );
  }

  const { models } = modelContext;

  return models[modelName];
}
