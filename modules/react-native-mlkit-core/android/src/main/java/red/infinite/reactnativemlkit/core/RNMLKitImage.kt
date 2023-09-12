package red.infinite.reactnativemlkit.core

import android.content.Context
import android.net.Uri
import android.util.Log
import com.google.mlkit.vision.common.InputImage


class RNMLKitImage(private var _imagePath: Uri, context: Context) {
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
        Log.d("RNMLKit", "RNMLKitImage: Loading Image from $_imagePath")
        try {
            Log.d("RNMLKit", "RNMLKitImage: Reading Bitmap")
            _image = InputImage.fromFilePath(context, _imagePath)
        } catch (e: Exception) {
            throw Exception("RNMLKitImage: Could not load image from $_imagePath", e)
        }
    }
}
