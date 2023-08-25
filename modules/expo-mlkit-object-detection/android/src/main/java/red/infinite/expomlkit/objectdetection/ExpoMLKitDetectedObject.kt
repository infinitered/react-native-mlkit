package red.infinite.expomlkit.objectdetection

import com.google.mlkit.vision.objects.DetectedObject
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import red.infinite.expomlkit.core.ExpoMLKitLabel
import red.infinite.expomlkit.core.ExpoMLKitRect

public data class ExpoMLKitDetectedObjectRecord(
    @Field var frame: ExpoMLKitRect,
    @Field var labels: List<ExpoMLKitLabel> = mutableListOf(),
    @Field var trackingId: Int? = null
) : Record

public class ExpoMLKitDetectedObject(private val detectedObject: DetectedObject) {
    val record: ExpoMLKitDetectedObjectRecord
        get() = ExpoMLKitDetectedObjectRecord(
            frame = ExpoMLKitRect.fromRect(detectedObject.boundingBox),
            labels = detectedObject.labels.map { ExpoMLKitLabel(it.text, it.confidence) },
            trackingId = detectedObject.trackingId
        )
}

