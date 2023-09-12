// Import the native module. On web, it will be resolved to RNMLKitFaceDetection.web.ts
// and on native platforms to RNMLKitFaceDetection.ts
import RNMLKitFaceDetectionModule from "./RNMLKitFaceDetectionModule";
import { RNMLKitFaceDetectorOptionsRecord } from "./types";

export * from "./types";

export async function initialize(options: RNMLKitFaceDetectorOptionsRecord) {
  return await RNMLKitFaceDetectionModule.initialize(options);
}

export async function detectFaces(imageUri: string) {
  return await RNMLKitFaceDetectionModule.detectFaces(imageUri);
}
