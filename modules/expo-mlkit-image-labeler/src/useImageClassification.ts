import { Asset } from "expo-asset";
import { useState, useEffect } from "react";

import {
  ExpoMLKitCustomImageLabelerContextValue,
  useExpoMLKitCustomImageLabelerContext,
  ModelAssets,
} from "./ExpoMLKItCustomImageLabelerContext";
import { ClassificationResult } from "./ExpoMLKitImageLabeler";

type Status = "init" | "loading" | "success" | "error";

type ClassifyImageHookResult = {
  result?: ClassificationResult;
  loading: boolean;
  error?: Error;
};

export function useImageClassification<T extends ModelAssets>(
  modelName: keyof T,
  image?: Asset
): ClassifyImageHookResult {
  const [result, setResult] = useState<ClassificationResult | undefined>(
    undefined
  );
  const [status, setStatus] = useState<Status>("init");
  const [error, setError] = useState<Error | undefined>(undefined);

  const context: ExpoMLKitCustomImageLabelerContextValue<T> =
    useExpoMLKitCustomImageLabelerContext();

  if (!context) {
    throw new Error(
      "useClassifyImage must be used within a <ModelContextProvider>"
    );
  }

  const model = context.models[modelName];

  useEffect(() => {
    if (!model) {
      setStatus("init");
      setResult(undefined);
      return;
    }

    if (!image) {
      setStatus("error");
      setResult(undefined);
      setError(new Error("useClassifyImage: image"));
      return;
    }

    const imagePath = image?.localUri;

    if (!imagePath) {
      setStatus("error");
      setResult(undefined);
      setError(new Error("useClassifyImage: image has no localUri"));
      return;
    }

    const classifyImage = async () => {
      if (!imagePath) {
        return;
      }
      setStatus("loading");
      try {
        if (model) {
          const classification = await model.classifyImage(imagePath);
          setResult(classification);
          setStatus("success");
        }
      } catch (err) {
        setError(err);
        setStatus("error");
      }
    };
    classifyImage();
  }, [model]);

  return {
    result,
    loading: status === "loading",
    error: status === "error" ? error : undefined,
  };
}
