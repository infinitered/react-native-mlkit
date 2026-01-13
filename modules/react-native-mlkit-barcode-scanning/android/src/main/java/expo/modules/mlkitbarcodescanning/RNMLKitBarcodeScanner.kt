import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.BarcodeScanner
import expo.modules.kotlin.AppContext
import kotlinx.coroutines.CompletableDeferred
import red.infinite.reactnativemlkit.core.RNMLKitImage
import red.infinite.reactnativemlkit.barcodescanning.RNMLKitBarcodeScannerResult

// private var options: RNMLKitBarcodeScannerOptions
class RNMLKitBarcodeScanner() {

    private var barcodeScanner: BarcodeScanner? = BarcodeScanning.getClient()

    suspend fun detectInImage(imagePath: String, appContext: AppContext): Result<RNMLKitBarcodeScannerResult> {
        val result = CompletableDeferred<Result<RNMLKitBarcodeScannerResult>>()

        try {
            if(appContext.reactContext == null) {
                val exception = Exception("RNMLKitBarcodeScanner: React Context is null")
                result.complete(Result.failure(exception))
                return result.await()
            }

            var image: InputImage = RNMLKitImage(Uri.parse(imagePath), appContext.reactContext!!).image

            barcodeScanner?.process(image)?.addOnSuccessListener { barcodes ->
                val expoBarcodes = RNMLKitBarcodeScannerResult(barcodes, imagePath)
                result.complete(Result.success(expoBarcodes))
            }?.addOnFailureListener { e ->
                result.complete(Result.failure(e))
            }
        } catch (e: Exception) {
            result.complete(Result.failure(e))
        }
        return result.await()
    }
}
