import { UnavailabilityError } from "expo-modules-core";

import { UseFaceDetectionReturnType } from "./useFacesInPhoto";
import { RNMLKIT_MODULE_NAME, WEB_ERROR } from "../constants";

export function useFacesInPhoto(imageUri?: string): UseFaceDetectionReturnType {
  return {
    clearFaces: () => {
      throw new UnavailabilityError(RNMLKIT_MODULE_NAME, WEB_ERROR);
    },
    error: WEB_ERROR,
    status: "ready",
    faces: [],
  } as UseFaceDetectionReturnType;
}
