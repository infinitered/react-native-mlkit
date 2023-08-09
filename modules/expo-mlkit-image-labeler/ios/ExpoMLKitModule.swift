import ExpoModulesCore
import MLKitCommon
import MLKitImageLabelingCustom
import MLKitVision

// Structure to represent the result of image labeling
struct ExpoMLKitImageLabelResult: Record {
    @Field
    var text: String = ""

    @Field
    var confidence: Float = 0.0

    @Field
    var index: Int = 0
}

// Structure to hold options for the image labeler
struct ExpoMLKitImageLabelerOptionsRecord: Record {
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

struct ExpoMLKitImageLabelerSpec: Record {
    @Field
    var modelName: String = ""

    @Field
    var modelPath: String = ""

    @Field
    var options: ExpoMLKitImageLabelerOptionsRecord? = nil
}

public class ExpoMLKitImageLabelerModule: Module {
    let ERROR_DOMAIN: String = "red.infinite.ExpoMLKit.ExpoMLKitImageLabelerModuleErrorDomain";
    var labelers: [String:ExpoMLKitImageLabeler] = [:]
    var specs: [String:ExpoMLKitImageLabelerSpec] = [:]

    var imageLabeler: ExpoMLKitImageLabeler?

    public func definition() -> ModuleDefinition {
        Name("ExpoMLKit")

        AsyncFunction("addModel") { (spec: ExpoMLKitImageLabelerSpec, promise: Promise) in
            let logger = Logger()
            let context = ExpoMLKitContext(logger: logger)
            do{
                logger.debug("ExpoMLKit", "addModel: Loading model '\(spec.modelName)' from \(spec.modelPath)")

                // trim "file://" if it's present at the start of the path
                let regex = try! NSRegularExpression(pattern: "file://")
                var modelPath = regex.stringByReplacingMatches(in: spec.modelPath, options: [], range: NSMakeRange(0, 7), withTemplate: "")

                let expoMlKitLabelerOptions = ExpoMLKitImageLabelerOptions(
                    confidenceThreshold: spec.options?.confidenceThreshold,
                    maxResultCount: spec.options?.maxResultCount
                )

                let imageLabeler = try ExpoMLKitImageLabeler(context: context, modelPath: modelPath, options: expoMlKitLabelerOptions)
                self.labelers[spec.modelName] = imageLabeler;
                self.specs[spec.modelName] = spec;

                promise.resolve(spec.modelName)
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "Error Loading Model \(error)" , domain: ERROR_DOMAIN)
            }

        }

        AsyncFunction("classifyImage") { (modelName:String, imagePath:String, promise:Promise) in
            let logger = Logger()
            let context = ExpoMLKitContext(logger: logger)

            guard let imageLabeler = self.labelers[modelName] else {
                logger.error("[classifyImage] Classification Failed: Cannot find model named '\(modelName). Has it been loaded?")
                rejectPromiseWithMessage(promise: promise, message: "[ExpoMLKit.classifyImage] Cannot find model named '\(modelName). Has it been loaded?", domain: ERROR_DOMAIN)
                return

            }

            Task {
                do {
                    let results = try await imageLabeler.classifyImage(imagePath: imagePath)
                    let resultRecords = results.map { ExpoMLKitImageLabelResult(text: $0.text, confidence: $0.confidence, index: $0.index) }

                    promise.resolve(resultRecords)
                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "Error occurred: \(error)", domain: ERROR_DOMAIN)
                }
            }

        }

        AsyncFunction("updateOptionsAndReload") {(modelName:String, newOptions:ExpoMLKitImageLabelerOptionsRecord, promise:Promise) in
            let logger = Logger()
            let context = ExpoMLKitContext(logger: logger)

            do {
                guard let spec = self.specs[modelName] else {
                    logger.error("[updateOptionsAndReload] No existing model with name \(modelName) found")
                    rejectPromiseWithMessage(promise: promise, message: "[ExpoMLKit.updateOptionsAndReload] No existing model with name \(modelName) found", domain: ERROR_DOMAIN)
                    return
                }

                spec.options = ExpoMLKitImageLabelerOptionsRecord(
                    confidenceThreshold: newOptions.confidenceThreshold,
                    maxResultCount: newOptions.maxResultCount
                )

                specs[modelName] = spec

                let imageLabeler = try ExpoMLKitImageLabeler(context: context, modelPath: spec.modelPath, options: ExpoMLKitImageLabelerOptions(
                    confidenceThreshold: newOptions.confidenceThreshold,
                    maxResultCount: newOptions.maxResultCount
                ))


                self.labelers[spec.modelName] = imageLabeler;
                self.specs[spec.modelName] = spec;

                promise.resolve(spec.modelName)
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "[ExpoMLKit.updateOptionsAndReload] Error Updating Options: \(error)" , domain: ERROR_DOMAIN)
            }


        }

        Function("isLoaded") {(modelName:String) -> Bool in
            let labeler = self.labelers[modelName]

            return labeler != nil
        }



    }
}
