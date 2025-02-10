import { useContext } from "react";

import {
  ModelAssets,
  ImageLabelingContext,
  Models,
} from "../context/ImageLabelingContext";

export function useImageLabeling<T extends ModelAssets>(modelName: keyof T) {
  const context: Models<T> | undefined = useContext(ImageLabelingContext);

  if (!context) {
    throw new Error(
      "useImageLabeling must be used within a ImageLabelingProvider"
    );
  }

  return context[modelName];
}
