import Foundation
import MLKitCommon
import MLKitObjectDetection
import ExpoMLKitCore
import MLKitObjectDetectionCustom

enum ExpoMLKitCustomObjectDetectorError: Error {
    case modelDoesNotExist(modelPath: String)
    case optionsAreNil
    case failedToCreateDetector
}

public class ExpoMLKitCustomObjectDetector: ExpoMLKitObjectDetectorCommon {
    public var name: String
    
    var localModel: LocalModel? = nil
    var nativeOptions: CustomObjectDetectorOptions?
    
    public init(name: String, modelPath: String, options: ExpoMLKitCustomObjectDetectorOptions) throws {
        self.localModel = LocalModel(path: modelPath)
        guard let model = localModel else {
            throw ExpoMLKitCustomObjectDetectorError.modelDoesNotExist(modelPath: modelPath)
        }
        self.name = name
        
        nativeOptions = try options.createWithLocalModel(localModel: model)
        
        guard nativeOptions !== nil else {
            throw ExpoMLKitCustomObjectDetectorError.optionsAreNil
        }
    }
    
    public func detectObjects(imagePath: String) async throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        print(" --> IMAGEPATH: \(imagePath)")
        let image = try ExpoMLKitImage(imagePath: imagePath)
        print("IMAGE \(image)")
        return try self.detectObjects(image: image)
    }
    
    public func detectObjects(image: ExpoMLKitImage) throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        guard nativeOptions !== nil else {
            throw ExpoMLKitCustomObjectDetectorError.optionsAreNil
        }
        let objectDetector = ObjectDetector.objectDetector(options: nativeOptions! )
        let visionImage = image.visionImage;
        print(visionImage.description)
        let result = try objectDetector.results(in: visionImage)
        print (result)
        return result.map({ object in
            return ExpoMLKitObjectDetectionObject(detectedObject: object).record
        })
    }
    
    
}
