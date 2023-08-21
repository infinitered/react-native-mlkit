package red.infinite.expomlkit.objectdetection

import android.util.Log
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ExpoMLKitObjectDetectorSpec : Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: ExpoMLKitObjectDetectorOptions? = null
}


class ExpoMLKitObjectDetectorMap {

    private val detectorMap = mutableMapOf<String, ExpoMLKitObjectDetector>()

    fun add(spec: ExpoMLKitObjectDetectorSpec): ExpoMLKitObjectDetector {
        Log.d("ExpoMLKit", "add: Loading model '${spec.modelName}' from ${spec.modelPath} with options ${spec.options}")

        detectorMap[spec.modelName] = ExpoMLKitObjectDetector(spec.modelPath, null)
        Log.d("ExpoMLKit", "add: ${detectorMap.size} models loaded");
        return detectorMap[spec.modelName]!!
    }

    operator fun get(modelName:String): ExpoMLKitObjectDetector? {
        return detectorMap[modelName]
    }

    fun remove(modelName:String): ExpoMLKitObjectDetector? {
        return detectorMap.remove(modelName)
    }

    fun clear() {
        detectorMap.clear()
    }

    fun size() {
        detectorMap.size
    }

    fun reloadWithNewOptions(modelName:String, options: ExpoMLKitObjectDetectorOptions):String {
        val labeler = detectorMap.getOrElse(modelName) {
            Log.e("ExpoMLKit","Model $modelName not found", Exception("Model $modelName not found"))
            throw Exception("Model $modelName not found")
        }
//        labeler.reloadWithNewOptions(options)
        return modelName
    }
}
