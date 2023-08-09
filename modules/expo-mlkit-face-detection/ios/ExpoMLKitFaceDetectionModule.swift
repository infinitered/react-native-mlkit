
import ExpoModulesCore
import MLKitFaceDetection
import ExpoMLKitCore

// Function to reject a promise with a specified message and domain
func rejectPromiseWithMessage(promise: Promise, message: String, domain: String) {
    promise.reject(
        NSError(domain: domain, code: 1, userInfo: [NSLocalizedDescriptionKey: message])
    )
}

let ERROR_DOMAIN: String = "red.infinite.expomlkit.FaceDetectorErrorDomain"


public class ExpoMLKitFaceDetectionModule: Module {
    var faceDetector: ExpoMLKitFaceDetector? = nil

    public func definition() -> ModuleDefinition {
        Name("ExpoMLKitFaceDetection")

        AsyncFunction("initialize") { (record: ExpoMLKitFaceDetectorOptionsRecord, promise: Promise) in
            let options = ExpoMLKitFaceDetectorOptions(record: record)
            self.faceDetector = ExpoMLKitFaceDetector(options: options)
            promise.resolve()
        }

        AsyncFunction("detectFaces") { (imagePath: String, promise: Promise) in
            let logger = Logger()

            Task {
                do {
                    guard let faceDetector = self.faceDetector else {
                        rejectPromiseWithMessage(promise: promise, message: "[ExpoMLKitFaceDetection.detectFace] Face detector not initialized", domain: ERROR_DOMAIN)
                        return
                    }
                    let image = try ExpoMLKitImage(imagePath: imagePath)
                    let result = try await faceDetector.detectFaces(image: image)
                    logger.debug(result)
                    // Use result to resolve promise
                    promise.resolve(result.record)

                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "[ExpoMLKitFaceDetection.detectFace] Error Detecting Faces: \(error)", domain: ERROR_DOMAIN)
                }
            }
        }
    }
}
