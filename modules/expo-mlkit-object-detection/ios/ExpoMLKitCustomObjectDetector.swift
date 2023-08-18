import Foundation
import MLKitCommon
import MLKitObjectDetection
import ExpoMLKitCore
import MLKitObjectDetectionCustom

enum ExpoMLKitCustomObjectDetectorError: Error {
    case modelDoesNotExist(modelPath: String)
    case optionsAreNil
}

public class ExpoMLKitCustomObjectDetector: ExpoMLKitObjectDetectorCommon {
    
    var localModel: LocalModel? = nil
    var customObjectDetectorOptions: CustomObjectDetectorOptions? = nil
    
    public init(name: String?, modelPath: String, options: ExpoMLKitCustomObjectDetectorOptions) throws {
        self.localModel = LocalModel(path: modelPath)
        guard let model = localModel else {
            throw ExpoMLKitCustomObjectDetectorError.modelDoesNotExist(modelPath: modelPath)
        }
        
        customObjectDetectorOptions = try options.createWithLocalModel(localModel: model)
        
        guard let customOptions = customObjectDetectorOptions else {
            throw ExpoMLKitCustomObjectDetectorError.optionsAreNil
        }
        
        let objectDetector = ObjectDetector.objectDetector(options: customOptions)
        super.init(name: name, objectDetector: objectDetector)
    }
}
