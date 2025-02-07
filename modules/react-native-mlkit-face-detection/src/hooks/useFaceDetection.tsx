import { useContext } from "react";

import { FaceDetectionContext } from "../context/faceDetectionContext";

/**
 * Hook used to access the face detector instance directly. Useful for advanced use cases.
 * Most of the time, you'll want to use the {@link useFacesInPhoto `useFacesInPhoto()`} hook instead.
 */
export function useFaceDetection() {
  const context = useContext(FaceDetectionContext);
  if (!context) {
    throw new Error(
      "useFaceDetection must be used within a FaceDetectionProvider"
    );
  }

  return context.faceDetector;
}
