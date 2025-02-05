package red.infinite.reactnativemlkit.objectdetection

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import red.infinite.reactnativemlkit.core.RNMLKitLog

class RNMLKitObjectDetectorSpec : Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: ObjectDetectorOptions? = null
}

const val LOG_TAG = "RNMLKitObjDetectMap"

class RNMLKitObjectDetectorMap {

    private val detectorMap = mutableMapOf<String, RNMLKitCustomObjectDetector>()
    private val log = RNMLKitLog(LOG_TAG)

    fun add(spec: RNMLKitObjectDetectorSpec): RNMLKitCustomObjectDetector {
        log.d("add: Loading model '${spec.modelName}' from ${spec.modelPath} with options ${spec.options}")
        detectorMap[spec.modelName] = RNMLKitCustomObjectDetector(spec.modelPath, spec.options)
        log.d("add: ${detectorMap.size} models in map");
        return detectorMap[spec.modelName]!!
    }

    operator fun get(modelName:String): RNMLKitCustomObjectDetector? {
        return detectorMap[modelName]
    }

    fun remove(modelName:String): RNMLKitCustomObjectDetector? {
        return detectorMap.remove(modelName)
    }

    fun clear() {
        detectorMap.clear()
    }

    val size: Int
        get() = detectorMap.size
}
