package red.infinite.expomlkit.facedetection

import android.graphics.PointF
import android.graphics.Rect
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import com.google.mlkit.vision.face.Face

data class ExpoMLKitFaceDetectionResultRecord(
    @Field var faces: List<ExpoMLKitFace> = mutableListOf(),
    @Field var imagePath: String
) : Record

class ExpoMLKitFaceDetectionResult(private val faces: List<Face>, private val imagePath: String) {
    val record: ExpoMLKitFaceDetectionResultRecord
        get() = ExpoMLKitFaceDetectionResultRecord(
            faces = faces.map { face ->
                ExpoMLKitFace().apply {
                    frame = ExpoMLKitRect.fromRect(face.boundingBox)
                    landmarks = face.allLandmarks.map { ExpoMLKitFaceLandmark().apply { type = it.landmarkType.toString(); position = ExpoMLKitPoint.fromPointF(it.position) } }
                    contours = face.allContours.map { ExpoMLKitFaceContour().apply { type = it.faceContourType.toString(); points = it.points.map(
                        ExpoMLKitPoint.Companion::fromPointF
                    )} }
                    trackingID = face.trackingId
                    headEulerAngleX = face.headEulerAngleX
                    headEulerAngleY = face.headEulerAngleY
                    headEulerAngleZ = face.headEulerAngleZ
                    smilingProbability = face.smilingProbability
                    leftEyeOpenProbability = face.leftEyeOpenProbability
                    rightEyeOpenProbability = face.rightEyeOpenProbability
                }
            },
            imagePath = imagePath
        )
}

data class ExpoMLKitFace(
    @Field var frame: ExpoMLKitRect = ExpoMLKitRect.zero(),
    @Field var landmarks: List<ExpoMLKitFaceLandmark> = mutableListOf(),
    @Field var contours: List<ExpoMLKitFaceContour> = mutableListOf(),
    @Field var trackingID: Int? = null,
    @Field var headEulerAngleX: Float? = null,
    @Field var headEulerAngleY: Float? = null,
    @Field var headEulerAngleZ: Float? = null,
    @Field var smilingProbability: Float? = null,
    @Field var leftEyeOpenProbability: Float? = null,
    @Field var rightEyeOpenProbability: Float? = null
) : Record

data class ExpoMLKitFaceLandmark(
    @Field var type: String = "",
    @Field var position: ExpoMLKitPoint = ExpoMLKitPoint()
) : Record

data class ExpoMLKitFaceContour(
    @Field var type: String = "",
    @Field var points: List<ExpoMLKitPoint> = mutableListOf()
) : Record

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
