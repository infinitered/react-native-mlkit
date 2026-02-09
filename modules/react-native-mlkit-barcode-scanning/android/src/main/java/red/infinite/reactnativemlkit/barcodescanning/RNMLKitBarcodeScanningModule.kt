package red.infinite.reactnativemlkit.barcodescanning

import android.net.Uri

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.runBlocking
import red.infinite.reactnativemlkit.core.RNMLKitModule

class RNMLKitBarcodeScanningModule : RNMLKitModule("RNMLKitBarcodeScanning") {
  private var barcodeScanner: RNMLKitBarcodeScanner? = null
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('RNMLKitBarcodeScanning')` in JavaScript.
    Name("RNMLKitBarcodeScanning")


    AsyncFunction("initialize") { options: RNMLKitBarcodeScannerOptionsRecord, promise: Promise ->
        log.d("initialize: Initializing Barcode Scanner")
        val scannerOptions = RNMLKitBarcodeScannerOptions(options)
        barcodeScanner = RNMLKitBarcodeScanner(scannerOptions)
        log.d("initialize: Barcode Scanner initialized")
        promise.resolve(null)
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("process") { imagePath: String, promise: Promise ->
      val imageUri = Uri.parse(imagePath)

      runBlocking suspend@{
        val barcodeScanner = barcodeScanner
        if (barcodeScanner == null) {
          handleException(promise, message = "Barcode Scanner not initialized")
          return@suspend
        }
        try {
          var result =
              barcodeScanner.detectInImage(imagePath, appContext).getOrElse {
                handleException(promise, it)
                throw it
              }
          promise.resolve(result.record)
        } catch (e: Exception) {
          handleException(promise, e)
        }

      }
    }
  }
}
