package red.infinite.expomlkit.core

import android.graphics.Rect
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class ExpoMLKitRect(
    @Field var origin: ExpoMLKitPoint,
    @Field var size: ExpoMLKitPoint
) : Record {
    companion object {
        fun fromRect(rect: Rect): ExpoMLKitRect {
            return ExpoMLKitRect(
                origin = ExpoMLKitPoint(rect.left.toFloat(), rect.top.toFloat()),
                size = ExpoMLKitPoint(rect.width().toFloat(), rect.height().toFloat())
            )
        }

        fun zero(): ExpoMLKitRect {
            return ExpoMLKitRect(
                origin = ExpoMLKitPoint.zero(),
                size = ExpoMLKitPoint.zero()
            )
        }
    }


}