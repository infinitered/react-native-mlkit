package red.infinite.reactnativemlkit.imagelabeling

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import com.google.mlkit.common.model.LocalModel
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.label.ImageLabeler
import com.google.mlkit.vision.label.ImageLabeling
import com.google.mlkit.vision.label.custom.CustomImageLabelerOptions
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.FileNotFoundException
import java.net.URL


class RNMLKitImageLabelerOptions(
    modelPath: String, maxResultCount: Int?, confidenceThreshold: Float?
) : Record {
    @Field
    val modelPath: String

    /** The maximum number of labels to return for an image */
    @Field
    val maxResultCount: Int?

    /** Labels with confidence below this threshold will not be returned in the results */
    @Field
    val confidenceThreshold: Float?

    init {
        this.modelPath = modelPath
        this.maxResultCount = maxResultCount
        this.confidenceThreshold = confidenceThreshold
    }

}

class RNMLKitImageLabeler(
    modelPath: String, private var options: RNMLKitImageLabelerOptions?
) {
    private val modelPath: String
    private var labeler: ImageLabeler? = null
    private val localModel: LocalModel
    var isLoaded: Boolean = false
        private set


    init {


        this.modelPath = Uri.parse(modelPath).path
            ?: throw FileNotFoundException("RNMLKitImageLabeler: Could not parse model path $modelPath")
        Log.d("RNMLKitImageLabeler", "init: parsed path successfully")
        localModel = LocalModel.Builder().setAbsoluteFilePath(this.modelPath).build()

        try {
            val labelerOptions = CustomImageLabelerOptions.Builder(localModel)
                .setMaxResultCount(options?.maxResultCount ?: 1)
                .setConfidenceThreshold(options?.confidenceThreshold ?: 0.0f).build()

            Log.d("RNMLKitImageLabeler", "init: created options successfully")




            if (labelerOptions == null) {
                Log.e("RNMLKitImageLabeler", "init: labelerOptions is null")
            } else {
                Log.i("RNMLKitImageLabeler", "init: labelerOptions is not null")
                Log.d(
                    "RNMLKitImageLabeler",
                    "init: labelerOptions.maxResultCount = ${labelerOptions.maxResultCount}"
                )
                Log.d(
                    "RNMLKitImageLabeler",
                    "init: labelerOptions.confidenceThreshold = ${labelerOptions.confidenceThreshold}"
                )
            }

            labeler = ImageLabeling.getClient(labelerOptions)
            Log.d("RNMLKitImageLabeler", "init: created labeler successfully")
            isLoaded = true
        } catch (e: Exception) {
            Log.e("RNMLKitImageLabeler", e.localizedMessage ?: "Unknown error")
            throw Exception("RNMLKitImageLabeler", e)
        }
    }


    suspend fun classifyImage(
        imagePath: String
    ): Result<List<RNMLKitImageLabelerLabel>> {

        var result = CompletableDeferred<Result<List<RNMLKitImageLabelerLabel>>>()

        val image: InputImage

        try {
            // TODO: Make a separate status state visible to user for "preprocessing image" before classification? Might require event based status updates.
            // TODO: Cache results for images that have already been classified?
            Log.d("RNMLKit", "classifyImage: Loading Image")
            val bitmap = BitmapFactory.decodeStream(withContext(Dispatchers.IO) {
                URL(imagePath).openStream()
            })
            image = InputImage.fromBitmap(bitmap, 0)
            Log.d("RNMLKit", "classifyImage: Image Loaded Successfully")
        } catch (e: Exception) {
            throw Exception("RNMLKitImageLabeler: Could not load image from $imagePath", e)
        }

        if (labeler == null || !isLoaded) {
            throw Exception("RNMLKitImageLabeler: Model is not loaded")
        }

        labeler?.process(image)?.addOnSuccessListener { labels ->
            Log.d("RNMLKit", "classifyImage.addOnSuccessListener: Got Labels")

            val expoLabels = labels.map { label ->
                RNMLKitImageLabelerLabel(
                    text = label.text, confidence = label.confidence, index = label.index
                )
            }

            result.complete(Result.success(expoLabels))
        }?.addOnFailureListener { e ->
            result.complete(Result.failure(e))
        }

        return result.await()
    }

    fun reloadWithNewOptions(options: RNMLKitImageLabelerOptions) {
        isLoaded = false
        this.options = options
        val labelerOptions = CustomImageLabelerOptions.Builder(localModel)
            .setMaxResultCount(options.maxResultCount ?: 1)
            .setConfidenceThreshold(options.confidenceThreshold ?: 0.0f).build()
        try {
            labeler = ImageLabeling.getClient(labelerOptions)
            isLoaded = true
        } catch (e: Exception) {
            throw Exception("RNMLKitImageLabeler.setOptions: Could not create labeler", e)
        }
    }


}
