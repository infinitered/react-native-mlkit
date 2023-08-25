package red.infinite.expomlkit.objectdetection

import com.google.mlkit.vision.objects.ObjectDetector

abstract class ExpoMLKitObjectDetector {
    internal abstract var objectDetector: ObjectDetector?
    abstract suspend fun detectObjects(
        imagePath: String
    ): Result<List<ExpoMLKitDetectedObject>>

    abstract val isLoaded: Boolean
}