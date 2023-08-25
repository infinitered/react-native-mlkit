package red.infinite.expomlkit.imagelabeling

import android.util.Log
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.runBlocking

class ExpoMLKitImageLabelerSpec : Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: ExpoMLKitImageLabelerOptions? = null
}

class ExpoMLKitImageLabelingModule : Module() {
    private val labelerMap = ExpoMLKitImageLabelerMap()


    override fun definition() = ModuleDefinition {
        Name("ExpoMLKitImageLabeling")

        AsyncFunction("addModel") { spec: ExpoMLKitImageLabelerSpec, promise: Promise ->
            try {
                Log.d(
                    "ExpoMLKit",
                    "addModel: Loading model '${spec.modelName}' from ${spec.modelPath}"
                )
                labelerMap.add(spec)
                promise.resolve(spec.modelName)
            } catch (e: Exception) {
                promise.reject(
                    CodedException(
                        "ExpoMLKitImageLabelingModule - Classifier Error: ${e.message}", e
                    )
                )
            }
        }



        AsyncFunction("classifyImage") { modelName: String, imagePath: String, promise: Promise ->
            Log.d("ExpoMLKit", "classifyImage: ${labelerMap.size()} ")
            runBlocking suspend@{
                val model: ExpoMLKitImageLabeler? = labelerMap[modelName]

                Log.d("ExpoMLKit", "definition: classifyImage: $modelName")

                if (model == null) {
                    promise.reject(
                        CodedException("rExpoMLKitImageLabelingModule - Classifier Error: Model $modelName not found")
                    )

                } else {
                    try {
                        val result = model.classifyImage(imagePath).getOrThrow()
                        promise.resolve(result)
                        return@suspend
                    } catch (e: Throwable) {
                        promise.reject(
                            CodedException(
                                "ExpoMLKitImageLabelingModule - Classifier Error: ${e.message}", e
                            )
                        )
                    }
                }
            }
        }

        AsyncFunction("updateOptionsAndReload") { modelName: String, options: ExpoMLKitImageLabelerOptions, promise: Promise ->
            Log.d(
                "ExpoMLKit",
                "updateOptionsAndReload: $modelName -- maxResultCount: ${options.maxResultCount} -- confidenceThreshold: ${options.confidenceThreshold}"
            )

            runBlocking {
                try {
                    labelerMap.reloadWithNewOptions(modelName, options)
                } catch (e: Exception) {
                    promise.reject(
                        CodedException(
                            "ExpoMLKitImageLabelingModule - Error Updating Options: ${e.message}", e
                        )
                    )
                }
            }

        }

        Function("isLoaded") { modelName: String ->
            val model: ExpoMLKitImageLabeler? = labelerMap[modelName]
            return@Function model?.isLoaded ?: false
        }

    }
}
