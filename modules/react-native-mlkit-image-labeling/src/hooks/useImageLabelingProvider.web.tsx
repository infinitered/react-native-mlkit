import { PropsWithChildren } from "react";

import { ImageLabelingConfig, ImageLabelingModels } from "../types";

interface Props<T extends ImageLabelingConfig> extends PropsWithChildren {
  models: Partial<ImageLabelingModels<T>>;
  deferInitialization?: boolean;
}

export function useImageLabelingProvider<T extends ImageLabelingConfig>(
  models: Partial<ImageLabelingModels<T>>
) {
  const ImageLabelingModelProvider = ({ children }: Props<T>) => ({ children });

  return { ImageLabelingModelProvider };
}
