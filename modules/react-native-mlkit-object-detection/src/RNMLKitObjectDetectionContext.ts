import { createContext, useContext } from "react";

import { ObjectDetectionAssetRecord, ObjectDetectionModels } from "./types";

export type ObjectDetectionContextValue<T extends ObjectDetectionAssetRecord> =
  ObjectDetectionModels<T>;

export const ObjectDetectionContext = createContext<
  ObjectDetectionContextValue<ObjectDetectionAssetRecord> | undefined
>(undefined);

export function useObjectDetectionContext<
  T extends ObjectDetectionAssetRecord
>() {
  const context = useContext(ObjectDetectionContext);
  if (!context) {
    throw new Error(
      "useObjectDetectionContext must be used within an ObjectDetectionContext.Provider"
    );
  }
  return context as ObjectDetectionContextValue<T>;
}
