package red.infinite.reactnativemlkit.objectdetection

import com.google.mlkit.vision.objects.DetectedObject
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import red.infinite.reactnativemlkit.core.RNMLKitLabel
import red.infinite.reactnativemlkit.core.RNMLKitRect

public data class RNMLKitDetectedObjectRecord(
    @Field var frame: RNMLKitRect,
    @Field var labels: List<RNMLKitLabel> = mutableListOf(),
    @Field var trackingId: Int? = null
) : Record

public class RNMLKitDetectedObject(private val detectedObject: DetectedObject) {
    val record: RNMLKitDetectedObjectRecord
        get() = RNMLKitDetectedObjectRecord(
            frame = RNMLKitRect.fromRect(detectedObject.boundingBox),
            labels = detectedObject.labels.map { RNMLKitLabel(it.text, it.confidence) },
            trackingId = detectedObject.trackingId
        )
}
