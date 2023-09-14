import { useAssets } from "expo-asset";
import React, { useState, useEffect, PropsWithChildren } from "react";

import { RNMLKitCustomObjectDetector } from "./RNMLKitCustomObjectDetector";
import { RNMLKitDefaultObjectDetector } from "./RNMLKitDefaultObjectDetector";
import {
  RNMLKitObjectDetectionContext,
  ModelAssets,
} from "./expoMLKitObjectDetectionContext";
import {
  RNMLKitCustomObjectDetectorOptions,
  RNMLKitObjectDetector,
  RNMLKitObjectDetectorOptions,
} from "./types";

export type ModelInfo = {
  model: number;
  options?: RNMLKitCustomObjectDetectorOptions;
};

export type AssetRecord = Record<string, ModelInfo>;

type Models<T extends Record<string, any>> = {
  [K in keyof T | "default"]: RNMLKitObjectDetector;
};

export function useObjectDetectionModels<T extends AssetRecord>({
  assets = {} as T,
  loadDefaultModel,
  defaultModelOptions,
}: {
  assets?: T;
  loadDefaultModel?: boolean;
  defaultModelOptions?: RNMLKitObjectDetectorOptions;
}) {
  const assetModels: number[] = Object.values(assets).map(({ model }) => model);

  const [assetObjects, assetsError] = useAssets(assetModels);
  const [loadedModels, setLoadedModels] = useState<Partial<Models<T>>>({});

  useEffect(() => {
    async function loadModel(
      name: string,
      model: RNMLKitObjectDetector
    ): Promise<[string, RNMLKitObjectDetector]> {
      await model.load();
      return [name, model];
    }

    async function loadModels() {
      const modelPromises: Promise<
        [string, RNMLKitObjectDetector | undefined]
      >[] = Object.entries(assets).map(
        async ([name, modelInfo]): Promise<
          [string, undefined | RNMLKitObjectDetector]
        > => {
          const assetObjectIndex = assetModels.indexOf(modelInfo.model);
          const assetObject = assetObjects?.[assetObjectIndex];
          if (!assetObject?.localUri) {
            return Promise.resolve([name, undefined]);
          }
          const model = new RNMLKitCustomObjectDetector(
            name,
            assetObject.localUri,
            modelInfo.options
          );
          return loadModel(name, model);
        }
      );

      if (loadDefaultModel) {
        const model = new RNMLKitDefaultObjectDetector(defaultModelOptions);
        modelPromises.push(loadModel("default", model));
      }

      const models = await Promise.all(modelPromises);

      const newModels = Object.fromEntries(models) as Partial<Models<T>>;
      setLoadedModels(newModels);
    }

    if ((assetObjects && !assetsError) || loadDefaultModel) {
      loadModels();
    }
  }, [assets, assetObjects, assetsError, loadDefaultModel]);

  return {
    models: loadedModels,
    ObjectDetectionModelContextProvider: (props: PropsWithChildren<object>) => (
      <ObjectDetectionModelProviderComponent {...props} models={loadedModels} />
    ),
  };
}

function ObjectDetectionModelProviderComponent<T extends ModelAssets>({
  children,
  models,
}: React.PropsWithChildren<{ models: Partial<Models<T>> }>) {
  return (
    <RNMLKitObjectDetectionContext.Provider value={{ models }}>
      {children}
    </RNMLKitObjectDetectionContext.Provider>
  );
}
