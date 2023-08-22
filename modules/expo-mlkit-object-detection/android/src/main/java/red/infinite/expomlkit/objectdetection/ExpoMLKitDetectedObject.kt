package red.infinite.expomlkit.objectdetection

import com.google.mlkit.vision.objects.DetectedObject
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class ExpoMLKitDetectedObjectRecord(
    @Field var boundingBox: ExpoMLKitRect,
    @Field var labels: List<ExpoMLKitLabel> = mutableListOf(),
    @Field var trackingId: Int? = null
) : Record

class ExpoMLKitDetectedObject(private val detectedObject: DetectedObject) {
    val record: ExpoMLKitDetectedObjectRecord
        get() = ExpoMLKitDetectedObjectRecord(
            boundingBox = ExpoMLKitRect.fromRect(detectedObject.boundingBox),
            labels = detectedObject.labels.map { ExpoMLKitLabel(it.text, it.confidence) },
            trackingId = detectedObject.trackingId
        )
}

data class ExpoMLKitLabel(
    @Field var text: String,
    @Field var confidence: Float
) : Record