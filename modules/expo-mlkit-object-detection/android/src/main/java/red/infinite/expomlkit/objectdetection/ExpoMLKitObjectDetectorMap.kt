package red.infinite.expomlkit.objectdetection

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import red.infinite.expomlkit.core.ExpoMLKitLog

class ExpoMLKitObjectDetectorSpec : Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: ExpoMLKitObjectDetectorOptions? = null
}

const val LOG_TAG = "ExpoMLKitObjDetectMap"

class ExpoMLKitObjectDetectorMap {

    private val detectorMap = mutableMapOf<String, ExpoMLKitCustomObjectDetector>()
    private val log = ExpoMLKitLog(LOG_TAG)

    fun add(spec: ExpoMLKitObjectDetectorSpec): ExpoMLKitCustomObjectDetector {
        log.d("add: Loading model '${spec.modelName}' from ${spec.modelPath} with options ${spec.options}")
        detectorMap[spec.modelName] = ExpoMLKitCustomObjectDetector(spec.modelPath, spec.options)
        log.d("add: ${detectorMap.size} models in map");
        return detectorMap[spec.modelName]!!
    }

    operator fun get(modelName:String): ExpoMLKitCustomObjectDetector? {
        return detectorMap[modelName]
    }

    fun remove(modelName:String): ExpoMLKitCustomObjectDetector? {
        return detectorMap.remove(modelName)
    }

    fun clear() {
        detectorMap.clear()
    }

    val size: Int
        get() = detectorMap.size
}
