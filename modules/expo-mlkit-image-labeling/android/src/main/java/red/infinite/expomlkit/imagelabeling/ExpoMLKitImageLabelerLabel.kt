package red.infinite.expomlkit.imagelabeling

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ExpoMLKitImageLabelerLabel(text: String, confidence: Float, index: Int) : Record {
    /** The text of the label */
    @Field
    val text: String

    /** The confidence of the label */
    @Field
    val confidence: Float

    /** The index of the label */
    @Field
    val index: Int

    init {
        this.text = text
        this.confidence = confidence
        this.index = index
    }
}
