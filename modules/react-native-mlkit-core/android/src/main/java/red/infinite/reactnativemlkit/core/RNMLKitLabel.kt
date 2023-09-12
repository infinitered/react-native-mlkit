package red.infinite.reactnativemlkit.core

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class RNMLKitLabel(
    @Field var text: String,
    @Field var confidence: Float,
    @Field var index: Int? = null,
) : Record
