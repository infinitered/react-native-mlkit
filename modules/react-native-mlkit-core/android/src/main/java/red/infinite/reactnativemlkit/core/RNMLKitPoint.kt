package red.infinite.reactnativemlkit.core

import android.graphics.PointF
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class RNMLKitPoint(
    @Field var x: Float = 0f,
    @Field var y: Float = 0f
) : Record {
    companion object {
        fun fromPointF(p: PointF): RNMLKitPoint {
            return RNMLKitPoint(p.x, p.y)
        }

        fun zero(): RNMLKitPoint {
            return RNMLKitPoint(0f, 0f)
        }
    }

}
