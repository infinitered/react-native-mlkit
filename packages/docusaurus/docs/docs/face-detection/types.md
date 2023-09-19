---
sidebar_position: 400
slug:  /face-detection/types
---

# Types.md

## `RNMLKitFaceDetectionResultRecord`

Represents the result of the face detection process, containing an array of detected faces, a success flag, any
potential errors, and the path to the image.

| Property | Description | Type | Default |
| ----------- | ----------------------------------------------- | --------------- | ------- | ------ |
| `faces`     | Array of detected faces. | `RNMLKitFace[]` | - |
| `success`   | Indicates if the face detection was successful. | `boolean`       | - |
| `error`     | Any potential errors during detection. | `string | null`   | `null` |
| `imagePath` | Path to the image being processed. | `string`        | - |

## `RNMLKitFace`

Details of each detected face, including frame, landmarks, contours, and various other properties.

| Property | Description | Type | Default |
| ---------------------------- | ----------------------------------------------------------- | ----------------------- | ------- | ------ |
| `frame`                      | Frame detailing the position and size of the detected
face. | `{x, y, width, height}` | - |
| `landmarks`                  | Array of landmarks on the face. | `RNMLKitFaceLandmark[]` | - |
| `contours`                   | Array of contours on the face. | `RNMLKitFaceContour[]`  | - |
| `hasTrackingID`              | Indicates if the face has a tracking ID. | `boolean`               | - |
| `trackingID`                 | The tracking ID of the face, if available. | `number | null`   | `null` |
| `hasHeadEulerAngleX`         | Indicates if the head Euler angle X is available. | `boolean`               | - |
| `headEulerAngleX`            | The head Euler angle X of the face, if available. | `number | null`   | `null` |
| `hasHeadEulerAngleY`         | Indicates if the head Euler angle Y is available. | `boolean`               | - |
| `headEulerAngleY`            | The head Euler angle Y of the face, if available. | `number | null`   | `null` |
| `hasHeadEulerAngleZ`         | Indicates if the head Euler angle Z is available. | `boolean`               | - |
| `headEulerAngleZ`            | The head Euler angle Z of the face, if available. | `number | null`   | `null` |
| `hasSmilingProbability`      | Indicates if the smiling probability is available. | `boolean`               | - |
| `smilingProbability`         | The smiling probability of the face, if available. | `number | null`   | `null` |
| `hasLeftEyeOpenProbability`  | Indicates if the left eye open probability is
available. | `boolean`               | - |
| `leftEyeOpenProbability`     | The left eye open probability of the face, if available. | `number | null`   | `null` |
| `hasRightEyeOpenProbability` | Indicates if the right eye open probability is
available. | `boolean`               | - |
| `rightEyeOpenProbability`    | The right eye open probability of the face, if
available. | `number | null`   | `null` |

## `FaceLandmarkType`

Types of landmarks that can be detected on a face.

| Landmark      |
|---------------|
| `leftEye`     |
| `leftMouth`   |
| `leftEar`     |
| `noseBase`    |
| `leftCheek`   |
| `rightEye`    |
| `rightMouth`  |
| `rightEar`    |
| `rightCheek`  |
| `bottomMouth` |
| `leftEarTip`  |
| `rightEarTip` |

## `RNMLKitFaceLandmark`

Specific landmarks detected on a face.

| Property   | Description                           | Type               | Default |
|------------|---------------------------------------|--------------------|---------|
| `type`     | Type of the landmark.                 | `FaceLandmarkType` | -       |
| `position` | Position of the landmark on the face. | `{x, y}`           | -       |

## `RNMLKitFaceContour`

Specific contours detected on a face.

| Property | Description | Type | Default |
| -------- | ----------------------------------------------------- | ------------------------------ | ------- | ------ |
| `type`   | Type of the contour. | `FaceContourType`              | - |
| `points` | Array of points representing the contour on the face. | `Array<{x: number, y: number}> | null`   | `null` |

## `FaceContourType`

Types of contours that can be detected on a face.

| Contour              |
|----------------------|
| `faceOval`           |
| `leftEyebrowTop`     |
| `leftEyebrowBottom`  |
| `rightEyebrowTop`    |
| `rightEyebrowBottom` |
| `leftEye`            |
| `rightEye`           |
| `upperLipTop`        |
| `upperLipBottom`     |
| `lowerLipTop`        |
| `lowerLipBottom`     |
| `noseBridge`         |
| `noseBottom`         |
| `leftCheekCenter`    |
| `rightCheekCenter`   |

## `RNMLKitFaceDetectorOptionsRecord`

Options for the face detector.

| Property | Description | Type | Default |
| -------------------- | ----------------------------------------------------------- | -------- | ------- | ------ |
| `performanceMode`    | The performance mode for the detector. | `string` | - |
| `landmarkMode`       | Indicates if landmark detection should be enabled. | `boolean | null`   | `null` |
| `contourMode`        | Indicates if contour detection should be enabled. | `boolean | null`   | `null` |
| `classificationMode` | Indicates if classification mode should be enabled. | `boolean | null`   | `null` |
| `minFaceSize`        | Minimum size of the face for detection. | `number | null`   | `null` |
| `isTrackingEnabled`  | Indicates if tracking should be enabled for detected faces. | `boolean | null`   | `null` |
