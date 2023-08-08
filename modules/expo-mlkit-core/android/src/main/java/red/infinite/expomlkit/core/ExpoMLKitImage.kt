package red.infinite.expomlkit.core

import android.content.Context
import android.net.Uri
import android.util.Log
import com.google.mlkit.vision.common.InputImage


class ExpoMLKitImage(private var _imagePath: Uri, context: Context) {
    private var _image: InputImage
    var image: InputImage
        get() = _image
        private set(value) {
            _image = value
        }
    var imagePath: Uri
        get() = _imagePath
        private set(value) {
            _imagePath = value
        }

    init {
        Log.d("ExpoMLKit", "ExpoMLKitImage: Loading Image from $_imagePath")
        try {
            Log.d("ExpoMLKit", "ExpoMLKitImage: Reading Bitmap")
            _image = InputImage.fromFilePath(context, _imagePath)
        } catch (e: Exception) {
            throw Exception("ExpoMLKitImage: Could not load image from $_imagePath", e)
        }
    }
}