import { PropsWithChildren } from "react";

import { RNMLKitFaceDetectorOptions } from "../types";

interface Props extends PropsWithChildren {
  options?: RNMLKitFaceDetectorOptions;
  deferInitialization?: boolean;
}

const RNMLKitFaceDetectionContextProvider = ({ children }: Props) => children;

export default RNMLKitFaceDetectionContextProvider;
