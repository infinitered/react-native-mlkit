// Import the native module. On web, it will be resolved to ExpoMLKitFaceDetection.web.ts
// and on native platforms to ExpoMLKitFaceDetection.ts
import ExpoMLKitFaceDetectionModule from "./ExpoMLKitFaceDetectionModule";
import { ExpoMLKitFaceDetectorOptionsRecord } from "./types";

export * from "./types";

export async function initialize(options: ExpoMLKitFaceDetectorOptionsRecord) {
  return await ExpoMLKitFaceDetectionModule.initialize(options);
}

export async function detectFaces(imageUri: string) {
  return await ExpoMLKitFaceDetectionModule.detectFaces(imageUri);
}
