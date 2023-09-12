package red.infinite.reactnativemlkit.core

import android.graphics.Rect
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class RNMLKitRect(
    @Field var origin: RNMLKitPoint,
    @Field var size: RNMLKitPoint
) : Record {
    companion object {
        fun fromRect(rect: Rect): RNMLKitRect {
            return RNMLKitRect(
                origin = RNMLKitPoint(rect.left.toFloat(), rect.top.toFloat()),
                size = RNMLKitPoint(rect.width().toFloat(), rect.height().toFloat())
            )
        }

        fun zero(): RNMLKitRect {
            return RNMLKitRect(
                origin = RNMLKitPoint.zero(),
                size = RNMLKitPoint.zero()
            )
        }
    }


}
