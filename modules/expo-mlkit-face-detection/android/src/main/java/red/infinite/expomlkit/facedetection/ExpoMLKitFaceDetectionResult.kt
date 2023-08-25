package red.infinite.expomlkit.facedetection

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import com.google.mlkit.vision.face.Face
import red.infinite.expomlkit.core.ExpoMLKitPoint
import red.infinite.expomlkit.core.ExpoMLKitRect

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

