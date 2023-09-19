import { createContext, PropsWithChildren, FC } from "react";

import { RNMLKitFaceDetector } from "../module/RNMLKitFaceDetector";
import { RNMLKitFaceDetectorOptions } from "../types";

export type ReactMLKitFaceDetectionContextValue = {
  faceDetector: RNMLKitFaceDetector;
};

export const ReactMLKitFaceDetectionContext =
  createContext<ReactMLKitFaceDetectionContextValue>({
    faceDetector: new RNMLKitFaceDetector(),
  });

export const RNMLKitFaceDetectionContextProvider: FC<
  PropsWithChildren<{
    options?: RNMLKitFaceDetectorOptions;
    deferInitialization?: boolean;
  }>
> = ({ options, deferInitialization, children }) => {
  const contextValue: ReactMLKitFaceDetectionContextValue = {
    faceDetector: new RNMLKitFaceDetector(options, deferInitialization),
  };

  return (
    <ReactMLKitFaceDetectionContext.Provider value={contextValue}>
      {children}
    </ReactMLKitFaceDetectionContext.Provider>
  );
};
