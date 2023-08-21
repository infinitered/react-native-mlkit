package red.infinite.expomlkit.objectdetection

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record


class ExpoMLKitObjectDetectorOptions: Record {
    @Field
    var shouldEnableClassification: Boolean = false
    @Field
    var shouldEnableMultipleObjects: Boolean = false
    @Field
    var detectorMode: String = "singleImage"
    @Field
    var classificationConfidenceThreshold: Float = 0.0f
    @Field
    var maxPerObjectLabelCount: Int = 10
}

public class ExpoMLKitObjectDetector (
    val modelPath: String, private var options: ExpoMLKitObjectDetectorOptions?
        ) {
    init {
        println("ExpoMLKitObjectDetector: init")
    }
}