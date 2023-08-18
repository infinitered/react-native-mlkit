import Foundation
import ExpoModulesCore
import MLKitObjectDetection

public struct ExpoMLKitObjectDetectorOptionsRecord: Record {
    public init() {}
    @Field
    var shouldEnableClassification: Bool?
    @Field
    var shouldEnableMultipleObjects: Bool?
    @Field
    var detectorMode: String?
}

enum ExpoMLKitObjectDetectorOptionsError:Error {
    case unknownDetectorMode(mode:String)
}

public class ExpoMLKitObjectDetectorOptions {
    var objectDetectorOptions: ObjectDetectorOptions

    init(objectDetectorOptions: ObjectDetectorOptions) {
        self.objectDetectorOptions = objectDetectorOptions
    }

    init(record: ExpoMLKitObjectDetectorOptionsRecord) throws {
            self.objectDetectorOptions = ObjectDetectorOptions()

        if let shouldEnableClassification = record.shouldEnableClassification {
            self.objectDetectorOptions.shouldEnableClassification = shouldEnableClassification
        }
        
        if let shouldEnableMultipleObjects = record.shouldEnableMultipleObjects {
            self.objectDetectorOptions.shouldEnableMultipleObjects = shouldEnableMultipleObjects
        }

        if let detectorModeString = record.detectorMode {
                    switch detectorModeString {
                    case "stream":
                        self.objectDetectorOptions.detectorMode = .stream
                    case "singleImage":
                        self.objectDetectorOptions.detectorMode = .singleImage
                    default:
                        throw ExpoMLKitObjectDetectorOptionsError.unknownDetectorMode(mode: detectorModeString)
                    }
                }
    }

    var record: ExpoMLKitObjectDetectorOptionsRecord {
        let record = ExpoMLKitObjectDetectorOptionsRecord()
        record.shouldEnableClassification = objectDetectorOptions.shouldEnableClassification
        record.shouldEnableMultipleObjects = objectDetectorOptions.shouldEnableMultipleObjects
        record.detectorMode = objectDetectorOptions.detectorMode == .stream ? "stream" : "singleImage"
        return record
    }
}
