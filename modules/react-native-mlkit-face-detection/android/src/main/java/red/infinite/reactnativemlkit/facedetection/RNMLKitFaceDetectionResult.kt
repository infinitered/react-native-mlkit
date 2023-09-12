package red.infinite.reactnativemlkit.facedetection

import expo.modules.kotlin.records.Record
import expo.modules.kotlin.records.Field
import com.google.mlkit.vision.face.Face
import red.infinite.reactnativemlkit.core.RNMLKitPoint
import red.infinite.reactnativemlkit.core.RNMLKitRect

data class RNMLKitFaceDetectionResultRecord(
    @Field var faces: List<RNMLKitFace> = mutableListOf(),
    @Field var imagePath: String
) : Record

class RNMLKitFaceDetectionResult(private val faces: List<Face>, private val imagePath: String) {
    val record: RNMLKitFaceDetectionResultRecord
        get() = RNMLKitFaceDetectionResultRecord(
            faces = faces.map { face ->
                RNMLKitFace().apply {
                    frame = RNMLKitRect.fromRect(face.boundingBox)
                    landmarks = face.allLandmarks.map { RNMLKitFaceLandmark().apply { type = it.landmarkType.toString(); position = RNMLKitPoint.fromPointF(it.position) } }
                    contours = face.allContours.map { RNMLKitFaceContour().apply { type = it.faceContourType.toString(); points = it.points.map(
                        RNMLKitPoint.Companion::fromPointF
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

data class RNMLKitFace(
    @Field var frame: RNMLKitRect = RNMLKitRect.zero(),
    @Field var landmarks: List<RNMLKitFaceLandmark> = mutableListOf(),
    @Field var contours: List<RNMLKitFaceContour> = mutableListOf(),
    @Field var trackingID: Int? = null,
    @Field var headEulerAngleX: Float? = null,
    @Field var headEulerAngleY: Float? = null,
    @Field var headEulerAngleZ: Float? = null,
    @Field var smilingProbability: Float? = null,
    @Field var leftEyeOpenProbability: Float? = null,
    @Field var rightEyeOpenProbability: Float? = null
) : Record

data class RNMLKitFaceLandmark(
    @Field var type: String = "",
    @Field var position: RNMLKitPoint = RNMLKitPoint()
) : Record

data class RNMLKitFaceContour(
    @Field var type: String = "",
    @Field var points: List<RNMLKitPoint> = mutableListOf()
) : Record
