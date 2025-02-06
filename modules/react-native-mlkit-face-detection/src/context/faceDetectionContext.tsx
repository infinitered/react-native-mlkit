import { createContext, PropsWithChildren, FC } from "react";

import { RNMLKitFaceDetector } from "../module/RNMLKitFaceDetector";
import { RNMLKitFaceDetectorOptions } from "../types";

export type FaceDetectionContextValue = {
  faceDetector: RNMLKitFaceDetector;
};

export const FaceDetectionContext = createContext<FaceDetectionContextValue>({
  faceDetector: new RNMLKitFaceDetector(),
});

export const FaceDetectionProvider: FC<
  PropsWithChildren<{
    options?: RNMLKitFaceDetectorOptions;
    deferInitialization?: boolean;
  }>
> = ({ options, deferInitialization, children }) => {
  const contextValue: FaceDetectionContextValue = {
    faceDetector: new RNMLKitFaceDetector(options, deferInitialization),
  };

  return (
    <FaceDetectionContext.Provider value={contextValue}>
      {children}
    </FaceDetectionContext.Provider>
  );
};
