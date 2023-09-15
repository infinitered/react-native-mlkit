import { useState, useEffect } from "react";

import { ClassificationResult } from "./RNMLKitImageLabeler";
import {
  RNMLKitImageLabelerContextValue,
  useRNMLKitImageLabelerContext,
  ModelAssets,
} from "./expoMLKitImageLabelerContext";

type Status = "init" | "loading" | "success" | "error";

type ClassifyImageHookResult = {
  result?: ClassificationResult;
  loading: boolean;
  error?: Error;
};

export function useImageClassification<T extends ModelAssets>(
  modelName: keyof T,
  image?: { uri?: string; localUri?: string }
): ClassifyImageHookResult {
  console.log(`--> useImageClassification (${String(modelName)})`);

  const [result, setResult] = useState<ClassificationResult | undefined>(
    undefined
  );
  const [status, setStatus] = useState<Status>("init");
  const [error, setError] = useState<Error | undefined>(undefined);

  const context: RNMLKitImageLabelerContextValue<T> =
    useRNMLKitImageLabelerContext();

  if (!context) {
    throw new Error(
      "useClassifyImage must be used within a <ModelContextProvider>"
    );
  }

  const model = context.models[modelName];
  const imagePath = image?.localUri ?? image?.uri;

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

    if (!imagePath) {
      setStatus("error");
      setResult(undefined);
      setError(new Error("useClassifyImage: image has no localUri"));
      return;
    }

    const classifyImage = async () => {
      console.log("useImageClassification: classifyImage");
      if (!imagePath) {
        console.log("no Image path");
        return;
      }
      setStatus("loading");
      try {
        if (model) {
          const classification = await model.classifyImage(imagePath);
          setResult(classification);
          setStatus("success");
        }
      } catch (err: any) {
        setError(err);
        setStatus("error");
      }
    };
    classifyImage();
  }, [model, imagePath]);

  return {
    result,
    loading: status === "loading",
    error: status === "error" ? error : undefined,
  };
}
