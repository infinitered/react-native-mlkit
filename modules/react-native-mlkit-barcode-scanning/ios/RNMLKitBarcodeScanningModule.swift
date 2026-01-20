import ExpoModulesCore
import MLKitBarcodeScanning
import RNMLKitCore

// TODO: move this to core?
// Function to reject a promise with a specified message and domain
func rejectPromiseWithMessage(promise: Promise, message: String, domain: String)
{
    promise.reject(
        NSError(
            domain: domain, code: 1,
            userInfo: [NSLocalizedDescriptionKey: message])
    )
}

let ERROR_DOMAIN: String =
    "red.infinite.reactnativemlkit.BarcodeScanningErrorDomain"

public class RNMLKitBarcodeScanningModule: Module {
    var barcodeScanner: BarcodeScanner? = nil

    public func definition() -> ModuleDefinition {
        Name("RNMLKitBarcodeScanning")

        AsyncFunction("initialize") { (promise: Promise) in
            self.barcodeScanner = BarcodeScanner.barcodeScanner()
            promise.resolve(nil)
        }

        AsyncFunction("process") { (imagePath: String, promise: Promise) in
            let logger = Logger(logHandlers: [
                createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)
            ])

            Task {
                do {
                    guard let barcodeScanner = self.barcodeScanner else {
                        rejectPromiseWithMessage(
                            promise: promise,
                            message:
                                "[RNMLKitBarcodeScanning.process] Barcode Scanner not initiliazed",
                            domain: ERROR_DOMAIN)
                        return
                    }
                    let image = try RNMLKitImage(imagePath: imagePath)
                    let barcodes = try await barcodeScanner.process(image.visionImage)

                    logger.debug(barcodes)

                    let result = RNMLKitBarcodeScannerResult(barcodes: barcodes)
                    promise.resolve(result.record)
                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "[RNMLKitBarcodeScanning.process] Error processing barcode: \(error)", domain: ERROR_DOMAIN)
                }
            }
        }
    }
}
