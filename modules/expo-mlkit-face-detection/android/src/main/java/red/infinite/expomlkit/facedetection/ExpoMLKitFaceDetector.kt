import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetector
import expo.modules.kotlin.AppContext
import kotlinx.coroutines.CompletableDeferred
import red.infinite.expomlkit.core.ExpoMLKitImage
import red.infinite.expomlkit.facedetection.ExpoMLKitFaceDetectionResult


class ExpoMLKitFaceDetector(private var options: ExpoMLKitFaceDetectorOptions) {

    private var faceDetector: FaceDetector? = FaceDetection.getClient(options.options)

    suspend fun detectFaces(imagePath: String, appContext: AppContext): Result<ExpoMLKitFaceDetectionResult> {
        val result = CompletableDeferred<Result<ExpoMLKitFaceDetectionResult>>()

        try {
            if(appContext.reactContext == null) {
                val exception = Exception("ExpoMLKitFaceDetection: React Context is null")
                result.complete(Result.failure(exception))
                return result.await()
            }

            var image:InputImage = ExpoMLKitImage(Uri.parse(imagePath), appContext.reactContext!!).image

            faceDetector?.process(image)?.addOnSuccessListener { faces ->
                val expoFaces = ExpoMLKitFaceDetectionResult(faces, imagePath)
                result.complete(Result.success(expoFaces))
            }?.addOnFailureListener { e ->
                result.complete(Result.failure(e))
            }
        } catch (e: Exception) {
            result.complete(Result.failure(e))
        }
        return result.await()
    }
}
