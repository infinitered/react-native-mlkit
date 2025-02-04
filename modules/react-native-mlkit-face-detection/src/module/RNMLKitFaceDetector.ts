import RNMLKitFaceDetectionModule from "./RNMLKitFaceDetectionModule";
import {
  RNMLKitFaceDetectorOptions,
  RNMLKitFaceDetectionResult,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function initialize(options?: RNMLKitFaceDetectorOptions) {
  return await RNMLKitFaceDetectionModule.initialize(options);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function detectFaces(imageUri: string) {
  return await RNMLKitFaceDetectionModule.detectFaces(imageUri);
}

export type FaceDetectionState =
  | "init"
  | "modelLoading"
  | "ready"
  | "detecting"
  | "done"
  | "error";

const DEFAULT_OPTIONS: RNMLKitFaceDetectorOptions = {
  performanceMode: "fast",
};

export class RNMLKitFaceDetector {
  public status: FaceDetectionState = "init";
  public error: string | undefined = undefined;
  private options: RNMLKitFaceDetectorOptions;

  constructor(options = DEFAULT_OPTIONS, deferInitialization?: boolean) {
    this.options = options;
    if (deferInitialization) {
      return;
    }
    this.initialize(options).catch((e) => console.error(e));
  }

  async detectFaces(imageUri: string) {
    this.status = "detecting";
    try {
      const result = await RNMLKitFaceDetectionModule.detectFaces(imageUri);
      this.status = "done";
      return result as RNMLKitFaceDetectionResult;
    } catch (e: unknown) {
      this.status = "error";
      console.error(
        e instanceof Error
          ? e.message
          : "An unknown error occurred while detecting faces"
      );
      return undefined;
    }
  }

  async initialize(options?: RNMLKitFaceDetectorOptions) {
    try {
      if (options) {
        this.options = options;
      }
      this.status = "modelLoading";
      await RNMLKitFaceDetectionModule.initialize(this.options);
      this.status = "ready";
    } catch (e: unknown) {
      this.status = "error";
      console.error(
        e instanceof Error
          ? e.message
          : "An unknown error occurred while initializing the model"
      );
    }
  }
}
