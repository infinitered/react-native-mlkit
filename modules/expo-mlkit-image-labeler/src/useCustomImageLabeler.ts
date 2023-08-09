import { useContext } from "react";

import { ExpoMLKitCustomImageLabelerContext } from "./ExpoMLKItCustomImageLabelerContext";

export function useCustomImageLabeler(modelName: string) {
  const modelContext = useContext(ExpoMLKitCustomImageLabelerContext);

  if (!modelContext) {
    throw new Error(
      "useCustomImageLabeler must be used within a <ExpoMLKitCustomImageLabelerContext.Provider>"
    );
  }

  const { models } = modelContext;

  const model = models[modelName];

  return {
    model,
    loading: !model,
    error: undefined,
  };
}
