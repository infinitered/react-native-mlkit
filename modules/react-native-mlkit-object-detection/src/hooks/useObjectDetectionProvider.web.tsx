import { PropsWithChildren } from "react";

import { ObjectDetectionConfig, ObjectDetectionModels } from "../types";

interface Props<T extends ObjectDetectionConfig> extends PropsWithChildren {
  models: Partial<ObjectDetectionModels<T>>;
  deferInitialization?: boolean;
}

export function useObjectDetectionProvider<T extends ObjectDetectionConfig>(
  models: Partial<ObjectDetectionModels<T>>
) {
  const ObjectDetectionModelProvider = ({ children }: Props<T>) => ({
    children,
  });

  return { ObjectDetectionModelProvider };
}
