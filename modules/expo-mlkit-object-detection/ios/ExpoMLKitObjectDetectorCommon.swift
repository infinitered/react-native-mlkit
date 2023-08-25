import MLKitObjectDetectionCommon
import ExpoMLKitCore
public protocol ExpoMLKitObjectDetectorCommon {
    var name: String {get set}

    func detectObjects(imagePath: String) async throws -> [ExpoMLKitObjectDetectionObjectRecord]
}
