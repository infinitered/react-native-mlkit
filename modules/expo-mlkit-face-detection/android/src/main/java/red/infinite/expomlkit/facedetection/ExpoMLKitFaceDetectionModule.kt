package red.infinite.expomlkit.facedetection

import ExpoMLKitFaceDetector
import ExpoMLKitFaceDetectorOptions
import ExpoMLKitFaceDetectorOptionsRecord
import android.net.Uri
import android.util.Log
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking


class ExpoMLKitFaceDetectionModule : Module() {


    private var faceDetector: ExpoMLKitFaceDetector? = null

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoMLKitFaceDetection')` in JavaScript.
        Name("ExpoMLKitFaceDetection")

        AsyncFunction("initialize") { options: ExpoMLKitFaceDetectorOptionsRecord, promise: Promise ->
            Log.d("ExpoMLKitFaceDetection", "initialize: Initializing Face Detection")
            faceDetector = ExpoMLKitFaceDetector(ExpoMLKitFaceDetectorOptions(options))
            Log.d("ExpoMLKitFaceDetection", "initialize: Initializing Face Detection")
            promise.resolve(null)
        }

        AsyncFunction("detectFaces") { imagePath: String, promise: Promise ->
            val imageUri = Uri.parse(imagePath)

            runBlocking suspend@{
                val faceDetector = faceDetector
                if (faceDetector == null) {
                    promise.reject(CodedException("ExpoMLKitFaceDetection: Face Detector not initialized"))
                    return@suspend
                }
                try {

                    var result =
                        faceDetector.detectFaces(imagePath, appContext).getOrElse {
                            promise.reject(CodedException("ExpoMLKitFaceDetection", it))
                            throw it
                        }

                    promise.resolve(result.record)

                } catch (e: Exception) {
                    promise.reject(CodedException("ExpoMLKitFaceDetection", e))
                }

            }
        }
    }
}
