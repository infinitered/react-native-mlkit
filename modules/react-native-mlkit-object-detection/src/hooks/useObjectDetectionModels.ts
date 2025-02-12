import { useAssets } from "expo-asset";
import { useState, useEffect } from "react";

import { RNMLKitCustomObjectDetector } from "../module/RNMLKitCustomObjectDetector";
import { RNMLKitDefaultObjectDetector } from "../module/RNMLKitDefaultObjectDetector";
import {
  RNMLKitObjectDetectorOptions,
  ObjectDetectionModels,
  ObjectDetectionConfig,
  RNMLKitObjectDetector,
} from "../types";

export function useObjectDetectionModels<T extends ObjectDetectionConfig>({
  assets = {} as T,
  loadDefaultModel,
  defaultModelOptions,
}: {
  assets?: T;
  loadDefaultModel?: boolean;
  defaultModelOptions?: RNMLKitObjectDetectorOptions;
}): ObjectDetectionModels<T> {
  const assetModels = Object.values(assets).map((info) => info.model);
  const [assetObjects, assetsError] = useAssets(assetModels);
  const [loadedModels, setLoadedModels] = useState<ObjectDetectionModels<T>>(
    {}
  );

  useEffect(() => {
    async function loadModels() {
      const modelPromises = Object.entries(assets).map(
        async ([name, modelInfo]): Promise<
          [string, RNMLKitObjectDetector | undefined]
        > => {
          const assetObjectIndex = assetModels.indexOf(modelInfo.model);
          const assetObject = assetObjects?.[assetObjectIndex];

          if (!assetObject?.localUri) {
            return [name, undefined];
          }

          const model = new RNMLKitCustomObjectDetector(
            name,
            assetObject.localUri,
            modelInfo.options
          );
          await model.load();
          return [name, model];
        }
      );

      if (loadDefaultModel) {
        const defaultModel = new RNMLKitDefaultObjectDetector(
          defaultModelOptions
        );
        await defaultModel.load();
        modelPromises.push(
          Promise.resolve(["default", defaultModel] as [
            string,
            RNMLKitObjectDetector
          ])
        );
      }

      const models = await Promise.all(modelPromises);
      setLoadedModels(Object.fromEntries(models) as ObjectDetectionModels<T>);
    }

    if ((assetObjects && !assetsError) || loadDefaultModel) {
      loadModels().catch(console.error);
    }
  }, [
    assets,
    assetObjects,
    assetsError,
    loadDefaultModel,
    defaultModelOptions,
  ]);

  return loadedModels;
}
