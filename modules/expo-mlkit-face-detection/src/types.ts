export interface ExpoMLKitFaceDetectionResultRecord {
  faces: ExpoMLKitFace[];
  success: boolean;
  error: string | null;
  imagePath: string;
}

export interface ExpoMLKitFace {
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks: ExpoMLKitFaceLandmark[];
  contours: ExpoMLKitFaceContour[];
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
    'leftEye'
    | 'leftMouth'
    | 'leftEar'
    | 'noseBase'
    | 'leftCheek'
    | 'rightEye'
    | 'rightMouth'
    | 'rightEar'
    | 'rightCheek'
    | 'bottomMouth'
    | 'leftEarTip'
    | 'rightEarTip';

export interface ExpoMLKitFaceLandmark {
  type: FaceLandmarkType | null;
  position: {
              x: number;
              y: number;
            } | null;
}

export interface ExpoMLKitFaceContour {
  type: FaceContourType | null;
  points: Array<{
    x: number;
    y: number;
  }> | null;
}

export type FaceContourType =
    'faceOval'
    | 'leftEyebrowTop'
    | 'leftEyebrowBottom'
    | 'rightEyebrowTop'
    | 'rightEyebrowBottom'
    | 'leftEye'
    | 'rightEye'
    | 'upperLipTop'
    | 'upperLipBottom'
    | 'lowerLipTop'
    | 'lowerLipBottom'
    | 'noseBridge'
    | 'noseBottom'
    | 'leftCheekCenter'
    | 'rightCheekCenter';

export interface ExpoMlKitFaceDetectorOptionsRecord {
  performanceMode: string;
  landmarkMode?: boolean | null;
  contourMode?: boolean | null;
  classificationMode?: boolean | null;
  minFaceSize?: number | null;
  isTrackingEnabled?: boolean | null;
}
