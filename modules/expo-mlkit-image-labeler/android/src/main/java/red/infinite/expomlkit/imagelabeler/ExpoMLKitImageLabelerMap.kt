package red.infinite.expomlkit.imagelabeler

import android.util.Log

class ExpoMLKitImageLabelerMap {

    private val labelerMap = mutableMapOf<String, ExpoMLKitImageLabeler>()

    fun add(spec: ExpoMLKitImageLabelerSpec): ExpoMLKitImageLabeler {
        Log.d("ExpoMLKit", "add: Loading model '${spec.modelName}' from ${spec.modelPath} with options ${spec.options}")

        labelerMap[spec.modelName] = ExpoMLKitImageLabeler(spec.modelPath, spec.options)
        Log.d("ExpoMLKit", "add: ${labelerMap.size} models loaded");
        return labelerMap[spec.modelName]!!
    }

    operator fun get(modelName:String): ExpoMLKitImageLabeler? {
        return labelerMap[modelName]
    }

    fun remove(modelName:String): ExpoMLKitImageLabeler? {
        return labelerMap.remove(modelName)
    }

    fun clear() {
        labelerMap.clear()
    }

    fun size() {
        labelerMap.size
    }

    fun reloadWithNewOptions(modelName:String, options: ExpoMLKitImageLabelerOptions):String {
        val labeler = labelerMap.getOrElse(modelName) {
            Log.e("ExpoMLKit","Model $modelName not found", Exception("Model $modelName not found"))
            throw Exception("Model $modelName not found")
        }
        labeler.reloadWithNewOptions(options)
        return modelName
    }
}
