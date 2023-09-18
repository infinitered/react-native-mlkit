// Import the native module. On web, it will be resolved to RNMLKitFaceDetection.web.ts
// and on native platforms to RNMLKitFaceDetection.ts

import RNMLKitFaceDetector from "./RNMLKitFaceDetector";
import { useFaceDetector } from "./useFaceDetector";

export * from "./types";

export { RNMLKitFaceDetector, useFaceDetector };
