import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoMLKitFaceDetection.web.ts
// and on native platforms to ExpoMLKitFaceDetection.ts

import ExpoMLKitFaceDetectionModule from "./ExpoMLkitFaceDetectionModule";
import { ExpoMlKitFaceDetectorOptionsRecord } from "./types";

export async function initialize(options: ExpoMlKitFaceDetectorOptionsRecord) {
  return await ExpoMLKitFaceDetectionModule.initialize(options);
}

export async function detectFaces(imageUri: String) {
  const result = await ExpoMLKitFaceDetectionModule.detectFaces(imageUri);
  return result;
}

export * from "./types";
