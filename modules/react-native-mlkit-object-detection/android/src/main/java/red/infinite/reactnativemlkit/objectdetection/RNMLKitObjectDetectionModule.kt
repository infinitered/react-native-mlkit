package red.infinite.reactnativemlkit.objectdetection

import red.infinite.reactnativemlkit.core.RNMLKitModule
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking

class RNMLKitObjectDetectionModule : RNMLKitModule("RNMLKitObjDet") {

    private val objectDetectorMap = RNMLKitObjectDetectorMap()
    private var defaultDetector: RNMLKitDefaultObjectDetector? = null

    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('RNMLKitObjectDetection')` in JavaScript.
        Name("RNMLKitObjectDetection")

        AsyncFunction("loadCustomModel") { spec: RNMLKitObjectDetectorSpec, promise: Promise ->

            if(spec.modelName == "default") {
                handleException(promise, message = "Model name 'default' is reserved")
                log.e( "Model name 'default' is reserved")
                return@AsyncFunction
            }

            log.i( "Loading Custom Model: ${spec.modelName}") // Log info
            try {
                objectDetectorMap.add(spec)
                log.v("Custom Model loaded: ${spec.modelName}") // Log verbose
                promise.resolve(spec.modelName)
            } catch (e: Exception) {
                handleException(promise, e)
            }
        }

        AsyncFunction("loadDefaultModel") { options: RNMLKitObjectDetectorOptions?, promise: Promise ->
            log.i( "Loading Default Model") // Log info
            try {
                defaultDetector = defaultDetector ?: RNMLKitDefaultObjectDetector(options)
                log.v( "Default Model loaded") // Log verbose
                promise.resolve(true)
            } catch (e: Exception) {
                handleException(promise, e)
            }
        }

        AsyncFunction("detectObjects") { modelName: String, imagePath: String, promise: Promise ->
            log.i( "Detecting Objects: $modelName, $imagePath") // Log info

            runBlocking suspend@{
                val objectDetector: RNMLKitObjectDetector? =
                    if (modelName == "default") defaultDetector else objectDetectorMap[modelName]
                if (objectDetector == null) {
                    handleException(promise, message = "Model $modelName not found")
                    return@suspend
                }

                log.v( "Fetched detector from map") // Log verbose
                try {
                    val result = objectDetector.detectObjects(imagePath).getOrThrow()
                    val records = result.map { i -> i.record }
                    promise.resolve(records)
                } catch (e: Throwable) {
                    handleException(promise, e)
                }
            }
        }

        Function("isLoaded") { modelName: String? ->
            log.v( "Checking if module ${modelName ?: "default"} is loaded") // Log verbose
            val objectDetector: RNMLKitObjectDetector? =
                if (modelName == "default" || modelName == null) defaultDetector else objectDetectorMap[modelName]

            return@Function objectDetector?.isLoaded ?: false
        }
    }
}
