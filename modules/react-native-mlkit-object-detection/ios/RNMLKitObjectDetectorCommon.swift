import MLKitObjectDetectionCommon
import RNMLKitCore
public protocol RNMLKitObjectDetectorCommon {
    var name: String {get set}

    func detectObjects(imagePath: String) async throws -> [RNMLKitObjectDetectionObjectRecord]
}
