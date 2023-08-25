package red.infinite.expomlkit.core

import android.graphics.PointF
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

data class ExpoMLKitPoint(
    @Field var x: Float = 0f,
    @Field var y: Float = 0f
) : Record {
    companion object {
        fun fromPointF(p: PointF): ExpoMLKitPoint {
            return ExpoMLKitPoint(p.x, p.y)
        }

        fun zero(): ExpoMLKitPoint {
            return ExpoMLKitPoint(0f, 0f)
        }
    }

}