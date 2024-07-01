import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetector
import expo.modules.kotlin.AppContext
import kotlinx.coroutines.CompletableDeferred
import red.infinite.reactnativemlkit.core.RNMLKitImage
import red.infinite.reactnativemlkit.facedetection.RNMLKitFaceDetectionResult


class RNMLKitTranslator(private var options: RNMLKitTranslatorOptions) {
}