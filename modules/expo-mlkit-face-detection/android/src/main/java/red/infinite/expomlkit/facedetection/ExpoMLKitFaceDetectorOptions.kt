//
//  ExpoMLKitFaceDetectorOptions.kt
//  ExpoMLKitFaceDetection
//
//  Created by Trevor Coleman on 2023-07-28.
//

import com.google.mlkit.vision.face.FaceDetectorOptions
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class ExpoMLKitFaceDetectorOptionsRecord(
    @Field var performanceMode: String = "fast",
    @Field var landmarkMode: Boolean? = null,
    @Field var contourMode: Boolean? = null,
    @Field var classificationMode: Boolean? = null,
    @Field var minFaceSize: Float? = null,
    @Field var isTrackingEnabled: Boolean? = null
) : Record

class ExpoMLKitFaceDetectorOptions(
    performanceMode: String? = null,
    landmarkMode: Boolean? = null,
    contourMode: Boolean? = null,
    classificationMode: Boolean? = null,
    minFaceSize: Float? = null,
    isTrackingEnabled: Boolean? = null
) {

    var performanceMode = performanceMode ?: "fast"
    var landmarkMode = landmarkMode ?: false
    var contourMode = contourMode ?: false
    var classificationMode = classificationMode ?: false
    var minFaceSize = minFaceSize ?: 0.1f
    var isTrackingEnabled = isTrackingEnabled ?: false

    constructor(record: ExpoMLKitFaceDetectorOptionsRecord) : this(
        performanceMode = record.performanceMode,
        landmarkMode = record.landmarkMode,
        contourMode = record.contourMode,
        classificationMode = record.classificationMode,
        minFaceSize = record.minFaceSize,
        isTrackingEnabled = record.isTrackingEnabled
    )

    val record: ExpoMLKitFaceDetectorOptionsRecord
        get() {
            return ExpoMLKitFaceDetectorOptionsRecord(
                performanceMode = this.performanceMode,
                landmarkMode = this.landmarkMode,
                contourMode = this.contourMode,
                classificationMode = this.classificationMode,
                minFaceSize = this.minFaceSize,
                isTrackingEnabled = this.isTrackingEnabled
            )
        }

    val options: FaceDetectorOptions
        get() {
            val optionsBuilder = FaceDetectorOptions.Builder()
                .setPerformanceMode(
                    if (this.performanceMode == "accurate") FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE else FaceDetectorOptions.PERFORMANCE_MODE_FAST
                )
                .setLandmarkMode(
                    if (this.landmarkMode) FaceDetectorOptions.LANDMARK_MODE_ALL else FaceDetectorOptions.LANDMARK_MODE_NONE
                )
                .setContourMode(
                    if (this.contourMode) FaceDetectorOptions.CONTOUR_MODE_ALL else FaceDetectorOptions.CONTOUR_MODE_NONE
                )
                .setClassificationMode(
                    if (this.classificationMode) FaceDetectorOptions.CLASSIFICATION_MODE_ALL else FaceDetectorOptions.CLASSIFICATION_MODE_NONE
                )
                .setMinFaceSize(this.minFaceSize)

            if (this.isTrackingEnabled) {
                optionsBuilder.enableTracking()
            }

            return optionsBuilder.build()
        }
}
