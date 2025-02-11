import { UnavailabilityError } from "expo-modules-core";
import { createContext } from "react";

import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";
import { RNMLKitClassifier } from "../module/RNMLKitClassifier";

export type ModelAssets = Record<string, number>;

export type Models<T extends ModelAssets> = {
  [K in keyof T]?: RNMLKitClassifier;
};

export const ImageLabelingContext = createContext<
  Models<ModelAssets> | undefined
>(undefined);

export function useRNMLKitImageLabelerContext() {
  throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
}
