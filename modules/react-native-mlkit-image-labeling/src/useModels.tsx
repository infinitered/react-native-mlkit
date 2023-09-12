//modules/react-native-mlkit-image-labeling/src/useModels.tsx
import { useAssets } from "expo-asset";
import React, { useState, useEffect, PropsWithChildren } from "react";

import { RNMLKitClassifier } from "./RNMLKitClassifier";
import {
  RNMLKitCustomImageLabelerOptions,
  RNMLKitImageLabelerSpec,
} from "./RNMLKitImageLabeler";
import {
  ModelAssets,
  RNMLKitImageLabelerContext,
} from "./expoMLKitImageLabelerContext";

export type AssetRecord = Record<
  string,
  { model: number; options?: RNMLKitCustomImageLabelerOptions }
>;

export type Models<T extends Record<string, any>> = {
  [K in keyof T]: RNMLKitClassifier;
};

export function useModels<T extends AssetRecord>(assets: T) {
  const assetNumbers = Object.values(assets).map(({ model }) => model);
  const [assetObjects, assetsError] = useAssets(assetNumbers);
  const [loadedModels, setLoadedModels] = useState<Partial<Models<T>>>({});

  useEffect(() => {
    async function loadModels() {
      const modelPromises = Object.entries(assets).map(
        async ([name, modelInfo]) => {
          const assetObjectIndex = assetNumbers.indexOf(modelInfo.model);
          const assetObject = assetObjects?.[assetObjectIndex];
          if (!assetObject?.localUri) return Promise.resolve([name, undefined]);

          const modelSpec: RNMLKitImageLabelerSpec = {
            modelPath: assetObject.localUri,
            options: modelInfo.options,
            modelName: name,
          };
          const model = new RNMLKitClassifier(modelSpec);
          await model.load();

          return [name, model];
        }
      );

      const models = await Promise.all(modelPromises);

      const newModels = Object.fromEntries(models);
      setLoadedModels(newModels);
    }

    if (assetObjects && !assetsError) {
      loadModels();
    }
  }, [assets, assetObjects, assetsError]);

  return {
    models: loadedModels,
    ObjectDetectionModelContextProvider: (props: PropsWithChildren<object>) => (
      <ModelContextProviderComponent {...props} models={loadedModels} />
    ),
  };
}

function ModelContextProviderComponent<T extends ModelAssets>({
  children,
  models,
}: React.PropsWithChildren<{ models: Partial<Models<T>> }>) {
  return (
    <RNMLKitImageLabelerContext.Provider value={{ models }}>
      {children}
    </RNMLKitImageLabelerContext.Provider>
  );
}
