import ExpoModulesCore
import MLKitCommon
import MLKitImageLabelingCustom
import MLKitVision

// Structure to represent the result of image labeling
struct RNMLKitImageLabelResult: Record {
    @Field
    var text: String = ""

    @Field
    var confidence: Float = 0.0

    @Field
    var index: Int = 0
}

// Structure to hold options for the image labeler
struct RNMLKitImageLabelerOptionsRecord: Record {
    @Field
    var confidenceThreshold: Float? = nil
    @Field
    var maxResultCount: Int = 10
}

// Function to reject a promise with a specified message and domain
func rejectPromiseWithMessage(promise: Promise, message: String, domain: String) {
    promise.reject(
        NSError(domain: domain, code: 1, userInfo: [NSLocalizedDescriptionKey: message])
    )
}

struct RNMLKitImageLabelerSpec: Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: RNMLKitImageLabelerOptionsRecord? = nil
}

public class RNMLKitImageLabelingModule: Module {
    let ERROR_DOMAIN: String = "red.infinite.RNMLKit.RNMLKitImageLabelingModuleErrorDomain"
    var labelers: [String: RNMLKitImageLabeler] = [:]
    var specs: [String: RNMLKitImageLabelerSpec] = [:]

    var imageLabeler: RNMLKitImageLabeler?

    public func definition() -> ModuleDefinition {
        Name("RNMLKitImageLabeling")

        AsyncFunction("addModel") { (spec: RNMLKitImageLabelerSpec, promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            let context = RNMLKitContext(logger: logger)
            do {
                logger.debug("RNMLKit", "addModel: Loading model '\(spec.modelName)' from \(spec.modelPath)")

                // trim "file://" if it's present at the start of the path
                let regex = try! NSRegularExpression(pattern: "file://")
                let modelPath = regex.stringByReplacingMatches(in: spec.modelPath, options: [], range: NSMakeRange(0, 7), withTemplate: "")

                let expoMlKitLabelerOptions = RNMLKitImageLabelerOptions(
                    confidenceThreshold: spec.options?.confidenceThreshold,
                    maxResultCount: spec.options?.maxResultCount
                )

                let imageLabeler = try RNMLKitImageLabeler(context: context, modelPath: modelPath, options: expoMlKitLabelerOptions)
                self.labelers[spec.modelName] = imageLabeler
                self.specs[spec.modelName] = spec
                logger.info("RNMLKit", "addModel: model loaded successfully!")
                promise.resolve(spec.modelName)
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "Error Loading Model \(error)", domain: ERROR_DOMAIN)
            }
        }

        AsyncFunction("classifyImage") { (modelName: String, imagePath: String, promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            logger.info("RNMLKit", "classify image: Classifying image: \(imagePath) ")

            guard let imageLabeler = self.labelers[modelName] else {
                logger.error("[classifyImage] Classification Failed: Cannot find model named '\(modelName). Has it been loaded?")
                rejectPromiseWithMessage(promise: promise, message: "[RNMLKit.classifyImage] Cannot find model named '\(modelName). Has it been loaded?", domain: ERROR_DOMAIN)
                return
            }

            Task {
                do {
                    let results = try await imageLabeler.classifyImage(imagePath: imagePath)
                    let resultRecords = results.map { RNMLKitImageLabelResult(text: $0.text, confidence: $0.confidence, index: $0.index) }
                    logger.info("RNMLKit", "classify image: Image classification successful")

                    promise.resolve(resultRecords)
                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "Error occurred: \(error)", domain: ERROR_DOMAIN)
                }
            }
        }

        AsyncFunction("updateOptionsAndReload") { (modelName: String, newOptions: RNMLKitImageLabelerOptionsRecord, promise: Promise) in
            let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
            let context = RNMLKitContext(logger: logger)

            do {
                guard let spec = self.specs[modelName] else {
                    logger.error("[updateOptionsAndReload] No existing model with name \(modelName) found")
                    rejectPromiseWithMessage(promise: promise, message: "[RNMLKit.updateOptionsAndReload] No existing model with name \(modelName) found", domain: ERROR_DOMAIN)
                    return
                }

                spec.options = RNMLKitImageLabelerOptionsRecord(
                    confidenceThreshold: newOptions.confidenceThreshold,
                    maxResultCount: newOptions.maxResultCount
                )

                specs[modelName] = spec

                let imageLabeler = try RNMLKitImageLabeler(context: context, modelPath: spec.modelPath, options: RNMLKitImageLabelerOptions(
                    confidenceThreshold: newOptions.confidenceThreshold,
                    maxResultCount: newOptions.maxResultCount
                ))

                self.labelers[spec.modelName] = imageLabeler
                self.specs[spec.modelName] = spec

                promise.resolve(spec.modelName)
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "[RNMLKit.updateOptionsAndReload] Error Updating Options: \(error)", domain: ERROR_DOMAIN)
            }
        }

        Function("isLoaded") { (modelName: String) -> Bool in
            let labeler = self.labelers[modelName]

            return labeler != nil
        }
    }
}
