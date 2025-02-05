import { useContext } from "react";

import {
  ModelAssets,
  RNMLKitImageLabelerContext,
  Models,
} from "./RNMLKitImageLabelerContext";

export function useImageLabeler<T extends ModelAssets>(modelName: keyof T) {
  const context: Models<T> | undefined = useContext(RNMLKitImageLabelerContext);

  if (!context) {
    throw new Error(
      "useImageLabeler must be used within a ImageLabelingProvider"
    );
  }

  return context[modelName];
}
