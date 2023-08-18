import Foundation
import ExpoModulesCore
import ExpoMLKitCore
import MLKitObjectDetectionCommon

public struct ExpoMLKitObjectDetectionObjectRecord: Record {
    public init() {  }
    
    @Field
    var frame: ExpoMLKitRect = ExpoMLKitRect()
    @Field
    var labels: [String] = []
    @Field
    var trackingID: Int? = nil
}

public class ExpoMLKitObjectDetectionObject {
    var detectedObject: Object

    init(detectedObject: Object) {
        self.detectedObject = detectedObject
    }

    var record: ExpoMLKitObjectDetectionObjectRecord {
        var record = ExpoMLKitObjectDetectionObjectRecord()
        record.frame = ExpoMLKitRect.fromCGRect(rect: detectedObject.frame)
        record.labels = detectedObject.labels.map { $0.text }
        record.trackingID = detectedObject.trackingID as? Int
        return record
    }
}
