import { UseFaceDetectionReturnType } from "./useFacesInPhoto";
import { WEB_ERROR } from "../constants";

export function useFacesInPhoto(imageUri?: string): UseFaceDetectionReturnType {
  return {
    clearFaces: () => {
      throw new Error(WEB_ERROR);
    },
    error: WEB_ERROR,
    status: "ready",
    faces: [],
  } as UseFaceDetectionReturnType;
}
