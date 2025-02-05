package red.infinite.reactnativemlkit.imagelabeling

import android.util.Log

class RNMLKitImageLabelerMap {

    private val labelerMap = mutableMapOf<String, RNMLKitImageLabeler>()

    fun add(spec: ImageLabelerSpec): RNMLKitImageLabeler {
        Log.d("RNMLKit", "add: Loading model '${spec.modelName}' from ${spec.modelPath} with options ${spec.options}")

        labelerMap[spec.modelName] = RNMLKitImageLabeler(spec.modelPath, spec.options)
        Log.d("RNMLKit", "add: ${labelerMap.size} models loaded");
        return labelerMap[spec.modelName]!!
    }

    operator fun get(modelName:String): RNMLKitImageLabeler? {
        return labelerMap[modelName]
    }

    fun remove(modelName:String): RNMLKitImageLabeler? {
        return labelerMap.remove(modelName)
    }

    fun clear() {
        labelerMap.clear()
    }

    fun size() {
        labelerMap.size
    }

    fun reloadWithNewOptions(modelName:String, options: RNMLKitImageLabelerOptions):String {
        val labeler = labelerMap.getOrElse(modelName) {
            Log.e("RNMLKit","Model $modelName not found", Exception("Model $modelName not found"))
            throw Exception("Model $modelName not found")
        }
        labeler.reloadWithNewOptions(options)
        return modelName
    }
}
