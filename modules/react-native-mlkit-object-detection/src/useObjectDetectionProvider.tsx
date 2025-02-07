import { PropsWithChildren } from "react";

import { ObjectDetectionContext } from "./ObjectDetectionContext";
import { ObjectDetectionConfig, ObjectDetectionModels } from "./types";

export function useObjectDetectionProvider<T extends ObjectDetectionConfig>(
  models: ObjectDetectionModels<T>
) {
  return {
    ObjectDetectionProvider: ({ children }: PropsWithChildren<object>) => (
      <ObjectDetectionContext.Provider value={{ ...models }}>
        {children}
      </ObjectDetectionContext.Provider>
    ),
  };
}
