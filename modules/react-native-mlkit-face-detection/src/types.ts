export interface RNMLKitFaceDetectionResult {
  faces: RNMLKitFace[];
  success: boolean;
  error: string | null;
  imagePath: string;
}

export interface RNMLKitFace {
  frame: {
    origin: {
      x: number;
      y: number;
    };
    size: {
      x: number;
      y: number;
    };
  };
  landmarks: RNMLKitFaceLandmark[];
  contours: RNMLKitFaceContour[];
  hasTrackingID: boolean;
  trackingID?: number | null;
  hasHeadEulerAngleX: boolean;
  headEulerAngleX?: number | null;
  hasHeadEulerAngleY: boolean;
  headEulerAngleY?: number | null;
  hasHeadEulerAngleZ: boolean;
  headEulerAngleZ?: number | null;
  hasSmilingProbability: boolean;
  smilingProbability?: number | null;
  hasLeftEyeOpenProbability: boolean;
  leftEyeOpenProbability?: number | null;
  hasRightEyeOpenProbability: boolean;
  rightEyeOpenProbability?: number | null;
}

export type FaceLandmarkType =
  | "leftEye"
  | "leftMouth"
  | "leftEar"
  | "noseBase"
  | "leftCheek"
  | "rightEye"
  | "rightMouth"
  | "rightEar"
  | "rightCheek"
  | "bottomMouth"
  | "leftEarTip"
  | "rightEarTip";

export interface RNMLKitFaceLandmark {
  type: FaceLandmarkType | null;
  position: {
    x: number;
    y: number;
  } | null;
}

export interface RNMLKitFaceContour {
  type: FaceContourType | null;
  points: Array<{
    x: number;
    y: number;
  }> | null;
}

export type FaceContourType =
  | "faceOval"
  | "leftEyebrowTop"
  | "leftEyebrowBottom"
  | "rightEyebrowTop"
  | "rightEyebrowBottom"
  | "leftEye"
  | "rightEye"
  | "upperLipTop"
  | "upperLipBottom"
  | "lowerLipTop"
  | "lowerLipBottom"
  | "noseBridge"
  | "noseBottom"
  | "leftCheekCenter"
  | "rightCheekCenter";

export interface RNMLKitFaceDetectorOptions {
  performanceMode: string;
  landmarkMode?: boolean | null;
  contourMode?: boolean | null;
  classificationMode?: boolean | null;
  minFaceSize?: number | null;
  isTrackingEnabled?: boolean | null;
}
