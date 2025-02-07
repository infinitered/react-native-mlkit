import Foundation
import MLKitCommon
import MLKitObjectDetection
import RNMLKitCore
import MLKitObjectDetectionCustom

enum RNMLKitCustomObjectDetectorError: Error {
    case modelDoesNotExist(modelPath: String)
    case optionsAreNil
    case failedToCreateDetector
}

public class RNMLKitCustomObjectDetector: RNMLKitObjectDetectorCommon {
    public var name: String

    var localModel: LocalModel? = nil
    var nativeOptions: CustomObjectDetectorOptions?

    public init(name: String, modelPath: String, options: RNMLKitCustomObjectDetectorOptions) throws {
        self.localModel = LocalModel(path: modelPath)
        guard let model = localModel else {
            throw RNMLKitCustomObjectDetectorError.modelDoesNotExist(modelPath: modelPath)
        }
        self.name = name

        nativeOptions = try options.createWithLocalModel(localModel: model)

        guard nativeOptions !== nil else {
            throw RNMLKitCustomObjectDetectorError.optionsAreNil
        }
    }

    public func detectObjects(imagePath: String) async throws -> [RNMLKitObjectDetectionObjectRecord] {
        print(" --> IMAGEPATH: \(imagePath)")
        let image = try RNMLKitImage(imagePath: imagePath)
        print("IMAGE \(image)")
        return try self.detectObjects(image: image)
    }

    public func detectObjects(image: RNMLKitImage) throws -> [RNMLKitObjectDetectionObjectRecord] {
        guard nativeOptions !== nil else {
            throw RNMLKitCustomObjectDetectorError.optionsAreNil
        }
        let objectDetector = ObjectDetector.objectDetector(options: nativeOptions! )
        let visionImage = image.visionImage;
        print(visionImage.description)
        let result = try objectDetector.results(in: visionImage)
        print (result)
        return result.map({ object in
            return RNMLKitObjectDetectionObject(detectedObject: object).record
        })
    }


}
