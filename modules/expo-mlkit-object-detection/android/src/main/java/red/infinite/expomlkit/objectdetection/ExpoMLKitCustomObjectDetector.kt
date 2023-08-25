package red.infinite.expomlkit.objectdetection

import android.graphics.BitmapFactory
import android.net.Uri
import com.google.mlkit.common.model.LocalModel
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.ObjectDetector
import com.google.mlkit.vision.objects.custom.CustomObjectDetectorOptions
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import red.infinite.expomlkit.core.ExpoMLKitLog
import java.io.FileNotFoundException
import java.net.URL


class ExpoMLKitObjectDetectorOptions : Record {
    @Field
    var shouldEnableClassification: Boolean = false

    @Field
    var shouldEnableMultipleObjects: Boolean = false

    @Field
    var detectorMode: String = "singleImage"

    @Field
    var classificationConfidenceThreshold: Float = 0.0f

    @Field
    var maxPerObjectLabelCount: Int = 10
}

class ExpoMLKitCustomObjectDetector(
    modelPath: String, private var options: ExpoMLKitObjectDetectorOptions?)
    : ExpoMLKitObjectDetector() {
    override var objectDetector: ObjectDetector? = null
    private val modelPath: String
    private val localModel: LocalModel
    private val log = ExpoMLKitLog("ExpoMLKitCustomObjDet")
    private var isModelLoaded: Boolean = false
    override val isLoaded: Boolean
        get() = isModelLoaded


    init {
        this.modelPath = Uri.parse(modelPath).path
            ?: throw FileNotFoundException("ExpoMLKitObjectDetector: Could not parse model path $modelPath")
        localModel = LocalModel.Builder().setAbsoluteFilePath(this.modelPath).build()

        try {
            val detectorMode = when (options?.detectorMode) {
                "singleImage" -> CustomObjectDetectorOptions.STREAM_MODE
                "stream" -> CustomObjectDetectorOptions.STREAM_MODE
                else -> CustomObjectDetectorOptions.SINGLE_IMAGE_MODE
            }

            val classificationConfidenceThreshold =
                options?.classificationConfidenceThreshold ?: 0.0f
            val maxPerObjectLabelCount = options?.maxPerObjectLabelCount ?: 10

            val objectDetectorOptions = CustomObjectDetectorOptions.Builder(localModel)
                .setDetectorMode(detectorMode)
                .setClassificationConfidenceThreshold(classificationConfidenceThreshold)
                .setMaxPerObjectLabelCount(maxPerObjectLabelCount)
                .apply {
                    options?.let {
                        if (it.shouldEnableClassification) enableClassification()
                        if (it.shouldEnableMultipleObjects) enableMultipleObjects()
                    }
                }
                .build()


            objectDetector = ObjectDetection.getClient(objectDetectorOptions)
            isModelLoaded = true


        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override suspend fun detectObjects(
        imagePath:String
    ): Result<List<ExpoMLKitDetectedObject>> {
        var result = CompletableDeferred<Result<List<ExpoMLKitDetectedObject>>>()

        val image: InputImage

        try {
            // TODO: Make a separate status state visible to user for "preprocessing image" before classification? Might require event based status updates.
            // TODO: Cache results for images that have already been classified?
            log.d("detectObjects: Loading Image")
            val bitmap = BitmapFactory.decodeStream(withContext(Dispatchers.IO) {
                URL(imagePath).openStream()
            })
            image = InputImage.fromBitmap(bitmap, 0)
            log.d("detectObjects: Image Loaded Successfully")
        } catch (e: Exception) {
            throw Exception("ExpoMLKitImageLabeler: Could not load image from $imagePath", e)
        }

        if (objectDetector == null || !isModelLoaded) {
            throw Exception("ExpoMLKitImageLabeler: Model is not loaded")
        }

        objectDetector?.process(image)?.addOnSuccessListener { detectedObjects ->
            log.d("detectObjects.addOnSuccessListener: Got Labels")

            val expoLabels = detectedObjects.map { detectedObject ->
                ExpoMLKitDetectedObject(
                    detectedObject
                )
            }

            result.complete(Result.success(expoLabels))
        }?.addOnFailureListener { e ->
            result.complete(Result.failure(e))
        }

        return result.await()
    }

}
