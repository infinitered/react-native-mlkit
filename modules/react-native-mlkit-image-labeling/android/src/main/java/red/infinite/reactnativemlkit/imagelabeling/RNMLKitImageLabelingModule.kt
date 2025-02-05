package red.infinite.reactnativemlkit.imagelabeling

import android.util.Log
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.runBlocking

class ImageLabelerSpec : Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: RNMLKitImageLabelerOptions? = null
}

class ImageLabelingModule : Module() {
    private val labelerMap = RNMLKitImageLabelerMap()


    override fun definition() = ModuleDefinition {
        Name("RNMLKitImageLabeling")

        AsyncFunction("addModel") { spec: ImageLabelerSpec, promise: Promise ->
            try {
                Log.d(
                    "RNMLKit",
                    "addModel: Loading model '${spec.modelName}' from ${spec.modelPath}"
                )
                labelerMap.add(spec)
                promise.resolve(spec.modelName)
            } catch (e: Exception) {
                promise.reject(
                    CodedException(
                        "ImageLabelingModule - Classifier Error: ${e.message}", e
                    )
                )
            }
        }



        AsyncFunction("classifyImage") { modelName: String, imagePath: String, promise: Promise ->
            Log.d("RNMLKit", "classifyImage: ${labelerMap.size()} ")
            runBlocking suspend@{
                val model: RNMLKitImageLabeler? = labelerMap[modelName]

                Log.d("RNMLKit", "definition: classifyImage: $modelName")

                if (model == null) {
                    promise.reject(
                        CodedException("rRNMLKitImageLabelingModule - Classifier Error: Model $modelName not found")
                    )

                } else {
                    try {
                        val result = model.classifyImage(imagePath).getOrThrow()
                        promise.resolve(result)
                        return@suspend
                    } catch (e: Throwable) {
                        promise.reject(
                            CodedException(
                                "ImageLabelingModule - Classifier Error: ${e.message}", e
                            )
                        )
                    }
                }
            }
        }

        AsyncFunction("updateOptionsAndReload") { modelName: String, options: RNMLKitImageLabelerOptions, promise: Promise ->
            Log.d(
                "RNMLKit",
                "updateOptionsAndReload: $modelName -- maxResultCount: ${options.maxResultCount} -- confidenceThreshold: ${options.confidenceThreshold}"
            )

            runBlocking {
                try {
                    labelerMap.reloadWithNewOptions(modelName, options)
                } catch (e: Exception) {
                    promise.reject(
                        CodedException(
                            "ImageLabelingModule - Error Updating Options: ${e.message}", e
                        )
                    )
                }
            }

        }

        Function("isLoaded") { modelName: String ->
            val model: RNMLKitImageLabeler? = labelerMap[modelName]
            return@Function model?.isLoaded ?: false
        }

    }
}
