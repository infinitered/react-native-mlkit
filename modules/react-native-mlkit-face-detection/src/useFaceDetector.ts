import * as RNMLKitFaceDetection from "@infinitered/react-native-mlkit-face-detection";
import { useState, useEffect, useCallback } from "react";

import { RNMLKitFace, RNMLKitFaceDetectorOptions } from "./types";

export type FaceDetectionState =
  | "init"
  | "modelLoading"
  | "ready"
  | "detecting"
  | "done"
  | "error";

export type UseFaceDetectorReturnType = {
  clearFaces: () => void;
  detectFaces: (imageUri: string) => Promise<void>;
  error?: string;
  state: FaceDetectionState;
  faces: RNMLKitFace[];
};

/**
 * Use this to fetch an MLKit face detector, which can be used to detect faces in images.
 *
 * @param [options] - The options for the face detector. See [the
 *   docs](https://infinitered.github.io/react-native-mlkit/docs/FaceDetection/options) for detailed information`
 */
export function useFaceDetector(
  options?: RNMLKitFaceDetectorOptions
): UseFaceDetectorReturnType {
  const [state, setState] = useState<FaceDetectionState>("init");
  const [faces, setFaces] = useState<RNMLKitFace[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  // Initialize face detection model
  useEffect(() => {
    async function loadModel() {
      setState("modelLoading");
      try {
        await RNMLKitFaceDetection.initialize(
          options ?? { performanceMode: "accurate" }
        );
      } catch (e: unknown) {
        setState("error");
        setError(e instanceof Error ? e.message : "An unknown error occurred");
        return;
      }
      setState("ready");
    }

    loadModel();
  }, [options]);

  const detectFaces = useCallback(async (imageUri: string) => {
    try {
      if (!imageUri) {
        setError("Image URI is required");
        setState("error");
        return;
      }
      // Reset state
      setFaces([]);
      setError(undefined);
      setState("detecting");
      // Detect Faces
      const detectedFaces = await RNMLKitFaceDetection.detectFaces(imageUri);
      // Update state
      setFaces(detectedFaces?.faces ?? []);
      setState("done");
    } catch (e: unknown) {
      setState("error");
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    }
  }, []);

  const clearFaces = useCallback(() => {
    if (state !== "done") return;
    setFaces([]);
    setState("ready");
  }, [state]);

  return {
    clearFaces,
    detectFaces,
    error,
    state,
    faces,
  };
}
