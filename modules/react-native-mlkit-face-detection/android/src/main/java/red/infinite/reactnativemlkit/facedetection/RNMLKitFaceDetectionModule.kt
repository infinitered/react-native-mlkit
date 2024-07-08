package red.infinite.reactnativemlkit.facedetection

import RNMLKitFaceDetector
import RNMLKitFaceDetectorOptions
import RNMLKitFaceDetectorOptionsRecord
import android.net.Uri

import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking
import red.infinite.reactnativemlkit.core.RNMLKitModule


class RNMLKitFaceDetectionModule : RNMLKitModule("RNMLKitFaceDetection") {
    private var faceDetector: RNMLKitFaceDetector? = null

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('RNMLKitFaceDetection')` in JavaScript.
        Name("RNMLKitFaceDetection")

        AsyncFunction("initialize") { options: RNMLKitFaceDetectorOptionsRecord, promise: Promise ->
            log.d("initialize: Initializing Face Detection")
            faceDetector = RNMLKitFaceDetector(RNMLKitFaceDetectorOptions(options))
            log.d("initialize: Initializing Face Detection")
            promise.resolve(null)
        }

        AsyncFunction("detectFaces") { imagePath: String, promise: Promise ->

            val assetManager = context.assets

            assetManager.list("/")?.mapNotNull { asset ->
                log.d(asset)
            }

            val imageUri = Uri.parse(imagePath)

            runBlocking suspend@{
                val faceDetector = faceDetector
                if (faceDetector == null) {
                    handleException(promise, message = "Face Detector not initialized")
                    return@suspend
                }
                try {
                    var result =
                        faceDetector.detectFaces(imagePath, appContext).getOrElse {
                            handleException(promise, it)
                            return@suspend
                        }
                    promise.resolve(result.record)
                } catch (e: Exception) {
                    handleException(promise, e)
                }

            }
        }
    }
}
