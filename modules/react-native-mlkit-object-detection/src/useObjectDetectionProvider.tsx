import { PropsWithChildren } from "react";

import { ObjectDetectionContext } from "./RNMLKitObjectDetectionContext";
import { ObjectDetectionAssetRecord, ObjectDetectionModels } from "./types";

export function useObjectDetectionProvider<
  T extends ObjectDetectionAssetRecord
>(models: ObjectDetectionModels<T>) {
  return {
    ObjectDetectionProvider: ({ children }: PropsWithChildren<object>) => (
      <ObjectDetectionContext.Provider value={{ ...models }}>
        {children}
      </ObjectDetectionContext.Provider>
    ),
  };
}
