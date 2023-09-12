import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetector
import expo.modules.kotlin.AppContext
import kotlinx.coroutines.CompletableDeferred
import red.infinite.reactnativemlkit.core.RNMLKitImage
import red.infinite.reactnativemlkit.facedetection.RNMLKitFaceDetectionResult


class RNMLKitFaceDetector(private var options: RNMLKitFaceDetectorOptions) {

    private var faceDetector: FaceDetector? = FaceDetection.getClient(options.options)

    suspend fun detectFaces(imagePath: String, appContext: AppContext): Result<RNMLKitFaceDetectionResult> {
        val result = CompletableDeferred<Result<RNMLKitFaceDetectionResult>>()

        try {
            if(appContext.reactContext == null) {
                val exception = Exception("RNMLKitFaceDetection: React Context is null")
                result.complete(Result.failure(exception))
                return result.await()
            }

            var image:InputImage = RNMLKitImage(Uri.parse(imagePath), appContext.reactContext!!).image

            faceDetector?.process(image)?.addOnSuccessListener { faces ->
                val expoFaces = RNMLKitFaceDetectionResult(faces, imagePath)
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
