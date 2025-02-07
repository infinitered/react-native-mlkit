import React, { PropsWithChildren } from "react";

import { ImageLabelingContext } from "./ImageLabelingContext";
import { ImageLabelingConfig, ImageLabelingModels } from "./types";

export function useImageLabelingProvider<T extends ImageLabelingConfig>(
  models: Partial<ImageLabelingModels<T>>
) {
  const ImageLabelingModelProvider = ({
    children,
  }: PropsWithChildren<object>) => (
    <ImageLabelingContext.Provider value={{ ...models }}>
      {children}
    </ImageLabelingContext.Provider>
  );

  return { ImageLabelingModelProvider };
}
