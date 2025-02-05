import { useAssets } from "expo-asset";
import { useState, useEffect } from "react";

import { RNMLKitClassifier } from "./RNMLKitClassifier";
import { ImageLabelerSpec } from "./RNMLKitImageLabeler";
import { ImageLabelingConfig, ImageLabelingModels } from "./types";

export function useImageLabelingModels<T extends ImageLabelingConfig>(
  assets: T
): Partial<ImageLabelingModels<T>> {
  const assetNumbers = Object.values(assets).map(({ model }) => model);

  const [assetObjects, assetsError] = useAssets(assetNumbers);
  const [loadedModels, setLoadedModels] = useState<
    Partial<ImageLabelingModels<T>>
  >({});

  useEffect(() => {
    async function loadModels() {
      const modelPromises = Object.entries(assets).map(
        async ([name, modelInfo]): Promise<
          [keyof T, undefined | RNMLKitClassifier]
        > => {
          const assetObjectIndex = assetNumbers.indexOf(modelInfo.model);
          const assetObject = assetObjects?.[assetObjectIndex];

          if (!assetObject?.localUri) {
            return [name as keyof T, undefined];
          }

          const modelSpec: ImageLabelerSpec = {
            modelPath: assetObject.localUri,
            options: modelInfo.options,
            modelName: name,
          };

          const model = new RNMLKitClassifier(modelSpec);
          await model.load();

          return [name as keyof T, model];
        }
      );

      const models = await Promise.all(modelPromises);
      const newModels = Object.fromEntries(models) as Partial<
        ImageLabelingModels<T>
      >;
      setLoadedModels(newModels);
    }

    if (assetObjects && !assetsError) {
      loadModels().catch((error) => {
        console.error("Failed to load models: ", error);
      });
    }
  }, [assets, assetObjects, assetsError]);

  return loadedModels;
}
