import RNMLKitFaceDetectionModule from "./RNMLKitFaceDetectionModule";
import { RNMLKitFaceDetectorOptions } from "./types";

async function initialize(options?: RNMLKitFaceDetectorOptions) {
  return await RNMLKitFaceDetectionModule.initialize(options);
}

async function detectFaces(imageUri: string) {
  return await RNMLKitFaceDetectionModule.detectFaces(imageUri);
}

export default {
  initialize,
  detectFaces,
};
