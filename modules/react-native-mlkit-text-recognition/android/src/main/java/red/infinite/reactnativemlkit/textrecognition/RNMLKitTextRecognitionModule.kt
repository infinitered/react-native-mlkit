package red.infinite.reactnativemlkit.textrecognition

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.google.mlkit.vision.common.InputImage
import android.graphics.BitmapFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext

suspend fun getInputImage(
  imagePath: String
): InputImage {
  try {
    val bitmap = BitmapFactory.decodeStream(withContext(Dispatchers.IO) {
      URL(imagePath).openStream()
    })

    return InputImage.fromBitmap(bitmap, 0)
  } catch (e: Exception) {
    throw Exception("RNMLKitTextRecognition: Could not load image from $imagePath", e)
  }
}

class RNMLKitTextRecognitionModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("RNMLKitTextRecognition")

    AsyncFunction("recognizeText") { imagePath: String, promise: Promise ->
      runBlocking {
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

        val image: InputImage = getInputImage(imagePath)

        recognizer.process(image)
          .addOnSuccessListener { visionText ->
            promise.resolve(visionText.text)
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
