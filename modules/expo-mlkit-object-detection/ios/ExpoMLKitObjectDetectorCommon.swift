import MLKitObjectDetectionCommon
import ExpoMLKitCore
public class ExpoMLKitObjectDetectorCommon {
    var objectDetector: ObjectDetector
    let name: String

    public init(name: String?, objectDetector: ObjectDetector) {
        self.name = name ?? "objectDetector"
        self.objectDetector = objectDetector
    }
    
    public func detectObjects(imagePath: String) async throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        print(" --> IMAGEPATH: \(imagePath)")
        let image = try ExpoMLKitImage(imagePath: imagePath)
        print("IMAGE \(image)")
        return try self.detectObjects(image: image)
    }
    
    public func detectObjects(image: ExpoMLKitImage) throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        let visionImage = image.visionImage;
        let result = try objectDetector.results(in: visionImage)
        print (result)
        return result.map({ object in
            return ExpoMLKitObjectDetectionObject(detectedObject: object).record
        })
    }
}
