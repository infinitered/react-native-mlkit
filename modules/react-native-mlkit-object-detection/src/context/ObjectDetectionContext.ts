import { createContext, useContext } from "react";

import { ObjectDetectionConfig, ObjectDetectionModels } from "../types";

export type ObjectDetectionContextValue<T extends ObjectDetectionConfig> =
  ObjectDetectionModels<T>;

export const ObjectDetectionContext = createContext<
  ObjectDetectionContextValue<ObjectDetectionConfig> | undefined
>(undefined);

export function useObjectDetectionContext<T extends ObjectDetectionConfig>() {
  const context = useContext(ObjectDetectionContext);
  if (!context) {
    throw new Error(
      "useObjectDetectionContext must be used within an ObjectDetectionContext.Provider"
    );
  }
  return context as ObjectDetectionContextValue<T>;
}
