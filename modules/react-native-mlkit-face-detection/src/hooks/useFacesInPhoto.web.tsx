import { UseFaceDetectorReturnType } from "./useFacesInPhoto";
import { WEB_ERROR } from "../constants";

export function useFacesInPhoto(imageUri?: string): UseFaceDetectorReturnType {
  return {
    clearFaces: () =>    {
      throw new Error(WEB_ERROR);
    } ,
    error: undefined,
    status: "ready",
    faces: [],
  } as UseFaceDetectorReturnType;
}
