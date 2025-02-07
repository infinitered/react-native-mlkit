// Import the native module. On web, it will be resolved to RNMLKitFaceDetection.web.ts
// and on native platforms to RNMLKitFaceDetection.ts

export * from "./context/faceDetectionContext";
export * from "./module/RNMLKitFaceDetector";
export * from "./types";
export * from "./hooks/useFacesInPhoto";
export { useFaceDetection } from "./hooks/useFaceDetection";
