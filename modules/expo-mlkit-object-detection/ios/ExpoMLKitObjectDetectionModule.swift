import ExpoModulesCore

// Function to reject a promise with a specified message and domain
func rejectPromiseWithMessage(promise: Promise, message: String, domain: String) {
    promise.reject(
        NSError(domain: domain, code: 1, userInfo: [NSLocalizedDescriptionKey: message])
    )
}

public class ExpoMLKitObjectDetectionModule: Module {
    let ERROR_DOMAIN: String = "red.infinite.expomlkit.ObjectDetectionErrorDomain" // 1. Moved inside the class
    var objectDetectors: [String: ExpoMLKitObjectDetectorCommon] = [:] // 2. Handling multiple detectors
    
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        Name("ExpoMLKitObjectDetection")
        
        AsyncFunction("loadCustomModel") { (name: String, modelPath: String, options: ExpoMLKitCustomObjectDetectorOptionsRecord?, promise: Promise) in
            let logger = Logger()
            
            let regex = try! NSRegularExpression(pattern: "file://")
            let trimmedPath = regex.stringByReplacingMatches(in: modelPath, options: [], range: NSMakeRange(0, 7), withTemplate: "")
            
            logger.info("ExpoMLKItObjectDetection: Loading Custom Model name:\(String(describing: name)) modelPath:\(trimmedPath)")
            var customModelOptions: ExpoMLKitCustomObjectDetectorOptions
            
            do {
                customModelOptions = try ExpoMLKitCustomObjectDetectorOptions(record: options)
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "Error creating options object \(error.localizedDescription)", domain: ERROR_DOMAIN)
                return
            }
            
            do {
                let objectDetector = try ExpoMLKitCustomObjectDetector(name: name, modelPath: trimmedPath, options: customModelOptions)
                self.objectDetectors[name] = objectDetector // 2. Store the detector
            } catch {
                rejectPromiseWithMessage(promise: promise, message: "Error instantiating object detector: \(error.localizedDescription)", domain: ERROR_DOMAIN)
                return
            }
            promise.resolve()
        }
        
        AsyncFunction("loadDefaultModel") { (options: ExpoMLKitObjectDetectorOptionsRecord?, promise: Promise) in
            if let _ = self.objectDetectors["default"] { // Check if the default model is already loaded
                promise.resolve()
                return
            }
            
            var defaultModelOptions: ExpoMLKitObjectDetectorOptions?
            
            if let optionsRecord = options {
                do {
                    defaultModelOptions = try ExpoMLKitObjectDetectorOptions(record: optionsRecord)
                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "Error creating options object \(error.localizedDescription)", domain: ERROR_DOMAIN)
                    return
                }
            }

            do {
                let objectDetector = ExpoMLKitObjectDetector(options: defaultModelOptions) // Instantiate the default detector with options
                self.objectDetectors["default"] = objectDetector // Store the default detector
                promise.resolve()
            }
        }

        
        AsyncFunction("detectObjects") { (modelName: String, imagePath: String, promise: Promise) in
            let logger = Logger()
                    
            guard let objectDetector = self.objectDetectors[modelName] else { // 2. Retrieve the detector by name
                logger.error("Model Not Found")
                rejectPromiseWithMessage(promise: promise, message: "Model Not Found", domain: ERROR_DOMAIN)
                return
            }
            
            Task {
                do {
                    let result = try await objectDetector.detectObjects(imagePath: imagePath)
                    logger.info("ExpoMLKitObjectDetection", "detectObjects: Detection completed successfully")
                    promise.resolve(result)
                } catch {
                    rejectPromiseWithMessage(promise: promise, message: "Error Detecting Objects \(error)", domain: ERROR_DOMAIN)
                    return
                }
            }
        }
        
        Function("isLoaded") { (modelName: String) -> Bool in // 3. isLoaded function
            let detector = self.objectDetectors[modelName]
            return detector != nil
        }
    }
}
