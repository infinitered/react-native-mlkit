---
sidebar_position: 99
---

# Options

## `RNMLKitFaceDetectorOptionsRecord`

Options for the face detector.

| Property             | Description                                                                                                                                                                                                                                              | Type                     | Default    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------- | ------ |
| `performanceMode`    | The performance mode for the detector. Determines the trade-off between speed and accuracy. Use `'fast'` for real-time applications where speed is critical, and `'accurate'` for applications where higher accuracy is desired at the expense of speed. | `'fast'` \| `'accurate'` | `accurate` |
| `landmarkMode`       | Indicates if landmark detection should be enabled.                                                                                                                                                                                                       | `boolean                 | null`      | `null` |
| `contourMode`        | Indicates if contour detection should be enabled.                                                                                                                                                                                                        | `boolean                 | null`      | `null` |
| `classificationMode` | Indicates if classification mode should be enabled.                                                                                                                                                                                                      | `boolean                 | null`      | `null` |
| `minFaceSize`        | Minimum size of the face for detection.                                                                                                                                                                                                                  | `number                  | null`      | `null` |
| `isTrackingEnabled`  | Indicates if tracking should be enabled for detected faces.                                                                                                                                                                                              | `boolean                 | null`      | `null` |
