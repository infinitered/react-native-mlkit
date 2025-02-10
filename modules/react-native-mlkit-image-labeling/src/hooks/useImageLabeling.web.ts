import { WEB_ERROR } from "../constants";
import { ModelAssets } from "../context/ImageLabelingContext";

export function useImageLabeling<T extends ModelAssets>(_modelName: keyof T) {
  throw new Error(WEB_ERROR);
}
