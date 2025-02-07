import ExpoModulesCore
import MLKitObjectDetectionCommon
import MLKitObjectDetectionCustom
import MLKitCommon

public struct RNMLKitCustomObjectDetectorOptionsRecord: Record {
    public init() {}

    @Field
    var shouldEnableClassification: Bool?
    @Field
    var shouldEnableMultipleObjects: Bool?
    @Field
    var detectorMode: String?
    @Field
    var classificationConfidenceThreshold: Float?
    @Field
    var maxPerObjectLabelCount: Int?
}

enum RNMLKitCustomObjectDetectorOptionsError: Error {
    case invalidDetectorMode(detectorMode: String)
}

public class RNMLKitCustomObjectDetectorOptions {
    private var shouldEnableClassification: Bool?
    private var shouldEnableMultipleObjects: Bool?
    private var detectorMode: ObjectDetectorMode?
    private var classificationConfidenceThreshold: Float?
    private var maxPerObjectLabelCount: Int?

    public init(record: RNMLKitCustomObjectDetectorOptionsRecord?) throws {
        if let record = record {
            self.shouldEnableClassification = record.shouldEnableClassification ?? true
            self.shouldEnableMultipleObjects = record.shouldEnableMultipleObjects ?? true
            print("-------->>>>>  \(String(describing: record.detectorMode))")
            if let detectorMode = record.detectorMode {
                print("DETECTORMODE: \(String(describing: record.detectorMode))")
                switch detectorMode {
                case "singleImage": self.detectorMode = .singleImage
                case "stream": self.detectorMode = .stream
                default: throw RNMLKitCustomObjectDetectorOptionsError.invalidDetectorMode(detectorMode: detectorMode)
                }
            }
            self.classificationConfidenceThreshold = record.classificationConfidenceThreshold ?? 0.0
            self.maxPerObjectLabelCount = record.maxPerObjectLabelCount ?? 10
        }
        print("END RESULT: \(String(describing: self.detectorMode))")
    }

    public func createWithLocalModel(localModel: LocalModel) throws -> CustomObjectDetectorOptions {
        return try createWithOptions(CustomObjectDetectorOptions(localModel: localModel))
    }

    public func createWithRemoteModel(remoteModel: CustomRemoteModel) throws -> CustomObjectDetectorOptions {
        return try createWithOptions(CustomObjectDetectorOptions(remoteModel: remoteModel))
    }

    private func createWithOptions(_ options: CustomObjectDetectorOptions) throws -> CustomObjectDetectorOptions {
        options.shouldEnableClassification = shouldEnableClassification ?? options.shouldEnableClassification
        options.shouldEnableMultipleObjects = shouldEnableMultipleObjects ?? options.shouldEnableMultipleObjects
        options.detectorMode = detectorMode ?? options.detectorMode
        options.classificationConfidenceThreshold = classificationConfidenceThreshold != nil ? NSNumber(value: classificationConfidenceThreshold!) : options.classificationConfidenceThreshold
        options.maxPerObjectLabelCount = maxPerObjectLabelCount ?? options.maxPerObjectLabelCount

        return options
    }
}
