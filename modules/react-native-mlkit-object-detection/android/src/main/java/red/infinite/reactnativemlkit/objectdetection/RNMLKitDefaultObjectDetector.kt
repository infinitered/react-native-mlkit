package red.infinite.reactnativemlkit.objectdetection

import android.graphics.BitmapFactory
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.ObjectDetector
import com.google.mlkit.vision.objects.defaults.ObjectDetectorOptions
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import red.infinite.reactnativemlkit.core.RNMLKitLog
import java.net.URL

class RNMLKitDefaultObjectDetector(
    private var options: ObjectDetectorOptions?,
) : RNMLKitObjectDetector() {
    override var objectDetector: ObjectDetector? = null
    private var isModelLoaded: Boolean = false
    private val log = RNMLKitLog("RNMLKitDefaultObjDet")


    init {
        try {
            val detectorMode = when (options?.detectorMode) {
                "singleImage" -> ObjectDetectorOptions.SINGLE_IMAGE_MODE
                "stream" -> ObjectDetectorOptions.STREAM_MODE
                else -> ObjectDetectorOptions.SINGLE_IMAGE_MODE
            }

            val objectDetectorOptions =
                ObjectDetectorOptions.Builder().setDetectorMode(detectorMode).apply {
                    options?.let {
                        if (it.shouldEnableClassification) enableClassification()
                        if (it.shouldEnableMultipleObjects) enableMultipleObjects()
                    }
                }.build()

            objectDetector = ObjectDetection.getClient(objectDetectorOptions)
            isModelLoaded = true


        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override suspend fun detectObjects(
        imagePath: String
    ): Result<List<RNMLKitDetectedObject>> {
        val result = CompletableDeferred<Result<List<RNMLKitDetectedObject>>>()

         log.d("detectObjects: Starting detection with default model")

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
            log.e("detectObjects: Could not load image from $imagePath", e)
            throw Exception("RNMLKitImageLabeler: Could not load image from $imagePath", e)
        }

        if (objectDetector == null || !isModelLoaded) {
            throw Exception("RNMLKitImageLabeler: Model is not loaded")
        }

        objectDetector?.process(image)?.addOnSuccessListener { detectedObjects ->
             log.d("detectObjects.addOnSuccessListener: Got Labels from default model")
             log.d("detectObjects.addOnSuccessListener: Detected ${detectedObjects.size} objects")
            log.d(detectedObjects.map { it.toString() }.toString())
            val expoLabels = detectedObjects.map { detectedObject ->
                RNMLKitDetectedObject(
                    detectedObject
                )
            }
            result.complete(Result.success(expoLabels))
        }?.addOnFailureListener { e ->
            log.e("detectObjects.addOnFailureListener: Failed to get labels", e)
            result.complete(Result.failure(e))
        }

        return result.await()
    }

    override val isLoaded: Boolean
        get() = isModelLoaded


}
