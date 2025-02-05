import React, { PropsWithChildren } from "react";

import { RNMLKitImageLabelerContext } from "./RNMLKitImageLabelerContext";
import { ImageLabelingConfig, ImageLabelingModels } from "./types";

export function useImageLabelingProvider<T extends ImageLabelingConfig>(
  models: Partial<ImageLabelingModels<T>>
) {
  const ImageLabellingModelProvider = ({
    children,
  }: PropsWithChildren<object>) => (
    <RNMLKitImageLabelerContext.Provider value={{ ...models }}>
      {children}
    </RNMLKitImageLabelerContext.Provider>
  );

  return { ImageLabellingModelProvider };
}
