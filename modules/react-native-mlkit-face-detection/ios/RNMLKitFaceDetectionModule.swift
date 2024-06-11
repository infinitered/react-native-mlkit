
import ExpoModulesCore
import MLKitFaceDetection
import RNMLKitCore

// Function to reject a promise with a specified message and domain
func rejectPromiseWithMessage(promise: Promise, message: String, domain: String) {
    promise.reject(
        NSError(domain: domain, code: 1, userInfo: [NSLocalizedDescriptionKey: message])
    )
}

let ERROR_DOMAIN: String = "red.infinite.reactnativemlkit.FaceDetectorErrorDomain"


public class RNMLKitFaceDetectionModule: Module {
    var faceDetector: RNMLKitFaceDetector? = nil

    public func definition() -> ModuleDefinition {
        Name("RNMLKitFaceDetection")

        AsyncFunction("initialize") { (record: RNMLKitFaceDetectorOptionsRecord, promise: Promise) in
            let options = RNMLKitFaceDetectorOptions(record: record)
            self.faceDetector = RNMLKitFaceDetector(options: options)
            promise.resolve()
        }

        AsyncFunction("detectFaces") { (imagePath: String, promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])

            Task {
                do {
                    guard let faceDetector = self.faceDetector else {
                        rejectPromiseWithMessage(promise: promise, message: "[RNMLKitFaceDetection.detectFace] Face detector not initialized", domain: ERROR_DOMAIN)
                        return
                    }
                    let image = try RNMLKitImage(imagePath: imagePath)
                    let result = try await faceDetector.detectFaces(image: image)
                    logger.debug(result)
                    // Use result to resolve promise
                    promise.resolve(result.record)

                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "[RNMLKitFaceDetection.detectFace] Error Detecting Faces: \(error)", domain: ERROR_DOMAIN)
                }
            }
        }
    }
}
