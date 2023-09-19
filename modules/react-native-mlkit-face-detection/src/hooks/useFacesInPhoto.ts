import { useEffect, useCallback, useState } from "react";

import { useFaceDetector } from "./useFaceDetector";
import { FaceDetectionState } from "../module/RNMLKitFaceDetector";
import { RNMLKitFace } from "../types";

export type UseFaceDetectorReturnType = {
  clearFaces: () => void;
  error?: string;
  status: FaceDetectionState;
  faces: RNMLKitFace[];
};

/**
 * Custom hook for detecting faces in a photo using ML Kit.
 *
 * @param {string} [imageUri] - The local URI of the image to detect faces in. (`myPhoto.uri` for
 *   `ExpoImagePickerResult`, or `myPhoto.localUri` for `ExpoImage`)
 */

export function useFacesInPhoto(imageUri?: string): UseFaceDetectorReturnType {
  const faceDetector = useFaceDetector();

  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<FaceDetectionState>("init");
  const [faces, setFaces] = useState<RNMLKitFace[]>([]);

  const detectFaces = useCallback(
    async (imageUri: string) => {
      try {
        if (!imageUri) {
          setError("Image URI is required");
          setStatus("error");
          return;
        }
        // Reset state
        setFaces([]);
        setError(undefined);
        setStatus("detecting");
        // Detect Faces
        const result = await faceDetector.detectFaces(imageUri);
        setFaces(result?.faces ?? []);
        setStatus("done");
      } catch (e: unknown) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      }
    },
    [faceDetector]
  );

  useEffect(() => {
    if (status !== faceDetector.status) {
      setStatus(faceDetector.status);
    }
  }, [status, faceDetector.status]);

  useEffect(() => {
    if (!imageUri) {
      return;
    }
    detectFaces(imageUri);
  }, [imageUri]);

  const clearFaces = useCallback(() => {
    setFaces([]);
    setStatus("ready");
  }, []);

  return {
    clearFaces,
    error,
    status,
    faces,
  } as UseFaceDetectorReturnType;
}
