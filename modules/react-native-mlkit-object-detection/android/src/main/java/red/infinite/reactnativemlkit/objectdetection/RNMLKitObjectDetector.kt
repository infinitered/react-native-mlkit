package red.infinite.reactnativemlkit.objectdetection

import com.google.mlkit.vision.objects.ObjectDetector

abstract class RNMLKitObjectDetector {
    internal abstract var objectDetector: ObjectDetector?
    abstract suspend fun detectObjects(
        imagePath: String
    ): Result<List<RNMLKitDetectedObject>>

    abstract val isLoaded: Boolean
}
