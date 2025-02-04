//modules/react-native-mlkit-image-labeling/src/useModels.tsx
import { AssetRecord, ModelInfo } from "@infinitered/react-native-mlkit-core";
import { useAssets } from "expo-asset";
import React, { useState, useEffect } from "react";

import { RNMLKitClassifier } from "./RNMLKitClassifier";
import {
  RNMLKitCustomImageLabelerOptions,
  RNMLKitImageLabelerSpec,
} from "./RNMLKitImageLabeler";
import { RNMLKitImageLabelerContext } from "./expoMLKitImageLabelerContext";

export type ImageLabellingModelAssetRecord =
  AssetRecord<RNMLKitCustomImageLabelerOptions>;

export type ImageLabellingModels<T extends Record<string, any>> = {
  [K in keyof T]: RNMLKitClassifier;
};

export type ImageLabellingModelInfo =
  ModelInfo<RNMLKitCustomImageLabelerOptions>;

export function useImageLabellingModels<
  T extends ImageLabellingModelAssetRecord
>(assets: T) {
  const assetNumbers = (Object.values(assets) as ImageLabellingModelInfo[]).map(
    ({ model }) => model
  );
  const [assetObjects, assetsError] = useAssets(assetNumbers);
  const [loadedModels, setLoadedModels] = useState<
    Partial<ImageLabellingModels<T>>
  >({});

  useEffect(() => {
    async function loadModels() {
      const modelPromises = Object.entries(assets).map(
        async ([name, modelInfo]: [keyof T, ImageLabellingModelInfo]): Promise<
          [keyof T, undefined | RNMLKitClassifier]
        > => {
          const assetObjectIndex = assetNumbers.indexOf(modelInfo.model);
          const assetObject = assetObjects?.[assetObjectIndex];
          if (!assetObject?.localUri) {
            return Promise.resolve([name, undefined] as [keyof T, undefined]);
          }

          const modelSpec: RNMLKitImageLabelerSpec = {
            modelPath: assetObject.localUri,
            options: modelInfo.options,
            modelName: name.toString(),
          };
          const model = new RNMLKitClassifier(modelSpec);
          await model.load();

          return [name, model] as [keyof T, RNMLKitClassifier];
        }
      );

      const models = await Promise.all(modelPromises);

      const newModels = Object.fromEntries(models) as Partial<
        ImageLabellingModels<T>
      >;
      setLoadedModels(newModels);
    }

    if (assetObjects && !assetsError) {
      loadModels().catch((error) => {
        console.error("Failed to load models: ", error);
      });
    }
  }, [assets, assetObjects, assetsError]);

  return {
    models: loadedModels,
    ImageLabelingContextProvider: ({
      children,
    }: {
      children: React.ReactNode;
    }) => (
      <ImageLabellingModelContextProviderComponent models={loadedModels}>
        {children}
      </ImageLabellingModelContextProviderComponent>
    ),
  };
}

function ImageLabellingModelContextProviderComponent({
  children,
  models,
}: React.PropsWithChildren<{
  models: Partial<ImageLabellingModels<ImageLabellingModelAssetRecord>>;
}>) {
  return (
    <RNMLKitImageLabelerContext.Provider value={{ models }}>
      {children}
    </RNMLKitImageLabelerContext.Provider>
  );
}
