import ExpoModulesCore
import MLKitCommon
import MLKitTextRecognition
import RNMLKitCore

public class RNMLKitTextRecognitionModule: Module {
    let ERROR_DOMAIN: String = "red.infinite.RNMLKit.RNMLKitTextRecognitionModuleErrorDomain"
    
  public func definition() -> ModuleDefinition {
    Name("RNMLKitTextRecognition")
    
    AsyncFunction("recognizeText") { (imagePath: String, promise: Promise) in
      let logger = Logger(logHandlers: [createOSLogHandler(category: Logger.EXPO_LOG_CATEGORY)])
      logger.info("RNMLKit", "recognize text: Recognizing text from image: \(imagePath) ")
      
      let options = TextRecognizerOptions()
      let textRecognizer = TextRecognizer.textRecognizer(options:options)
      
      let image = try RNMLKitImage(imagePath: imagePath)
      
      Task {
        do {
          let result = try await textRecognizer.process(image.visionImage)
          
          promise.resolve(mapTextToRecord(result))
        } catch {
          promise.reject(
              NSError(domain: ERROR_DOMAIN, code: 1, userInfo: [NSLocalizedDescriptionKey: "Error occurred: \(error)"])
          )
        }
      }
    }
  }
}
