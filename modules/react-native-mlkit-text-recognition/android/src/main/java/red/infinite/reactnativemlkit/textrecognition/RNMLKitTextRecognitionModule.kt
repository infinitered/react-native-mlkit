package red.infinite.reactnativemlkit.textrecognition

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.common.InputImage
import kotlinx.coroutines.runBlocking
import red.infinite.reactnativemlkit.core.RNMLKitImage
import android.net.Uri

class RNMLKitTextRecognitionModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("RNMLKitTextRecognition")

    AsyncFunction("recognizeText") { imagePath: String, promise: Promise ->
      runBlocking {
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        val image: InputImage = RNMLKitImage(Uri.parse(imagePath), appContext.reactContext!!).image

        recognizer.process(image)
          .addOnSuccessListener { visionText ->
            promise.resolve(mapTextToRecord(visionText))
          }
          .addOnFailureListener { e ->
            promise.reject(
              CodedException(
                "RNMLKitTextRecognitionModule - Error: ${e.message}", e
              )
            )
          }
      }
    }
  }
}
