package red.infinite.expomlkit.objectdetection

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
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

    private val modelPath: String
    private val localModel: LocalModel


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

            val unbuiltOptions = CustomObjectDetectorOptions.Builder(localModel).setDetectorMode(
                detectorMode
            ).setClassificationConfidenceThreshold(classificationConfidenceThreshold)
                .setMaxPerObjectLabelCount(maxPerObjectLabelCount)

            if (options?.shouldEnableClassification == true) {
                unbuiltOptions.enableClassification()
            }

            if (options?.shouldEnableMultipleObjects == true) {
                unbuiltOptions.enableMultipleObjects()
            }
            val objectDetectorOptions = unbuiltOptions.build()

            objectDetector = ObjectDetection.getClient(objectDetectorOptions)


        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    suspend fun detectObjects(
        imagePath:String
    ) {
        var result = CompletableDeferred<Result<List<ExpoMLKitImageLabelerLabel>>>()

        val image: InputImage

        try {
            // TODO: Make a separate status state visible to user for "preprocessing image" before classification? Might require event based status updates.
            // TODO: Cache results for images that have already been classified?
            Log.d("ExpoMLKit", "classifyImage: Loading Image")
            val bitmap = BitmapFactory.decodeStream(withContext(Dispatchers.IO) {
                URL(imagePath).openStream()
            })
            image = InputImage.fromBitmap(bitmap, 0)
            Log.d("ExpoMLKit", "classifyImage: Image Loaded Successfully")
        } catch (e: Exception) {
            throw Exception("ExpoMLKitImageLabeler: Could not load image from $imagePath", e)
        }

        if (labeler == null || !isLoaded) {
            throw Exception("ExpoMLKitImageLabeler: Model is not loaded")
        }

        labeler?.process(image)?.addOnSuccessListener { labels ->
            Log.d("ExpoMLKit", "classifyImage.addOnSuccessListener: Got Labels")

            val expoLabels = labels.map { label ->
                ExpoMLKitImageLabelerLabel(
                    text = label.text, confidence = label.confidence, index = label.index
                )
            }

            result.complete(Result.success(expoLabels))
        }?.addOnFailureListener { e ->
            result.complete(Result.failure(e))
        }

        return result.await()
    }


}
