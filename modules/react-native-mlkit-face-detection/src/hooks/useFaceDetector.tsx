import { useContext } from "react";

import { ReactMLKitFaceDetectionContext } from "../context/ReactMLKitFaceDetectionContext";

/**
 * Hook used to access the face detector instance directly. Useful for advanced use cases.
 * Most of the time, you'll want to use the {@link useFacesInPhoto `useFacesInPhoto()`} hook instead.
 */
export function useFaceDetector() {
  const context = useContext(ReactMLKitFaceDetectionContext);
  console.log("context", context);
  if (!context) {
    throw new Error(
      "useFaceDetector must be used within a ReactMLKitFaceDetectionContextProvider"
    );
  }

  return context.faceDetector;
}
