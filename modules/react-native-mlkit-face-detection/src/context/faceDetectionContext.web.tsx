import { PropsWithChildren } from "react";

import { RNMLKitFaceDetectorOptions } from "../types";

interface Props extends PropsWithChildren {
  options?: RNMLKitFaceDetectorOptions;
  deferInitialization?: boolean;
}

export const FaceDetectionProvider = ({ children }: Props) => children;
