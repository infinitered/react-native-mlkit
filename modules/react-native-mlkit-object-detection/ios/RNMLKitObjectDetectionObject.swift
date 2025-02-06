import Foundation
import ExpoModulesCore
import RNMLKitCore
import MLKitObjectDetectionCommon
import RNMLKitCore

public struct RNMLKitObjectDetectionObjectRecord: Record {
    public init() {  }

    @Field
    var frame: RNMLKitRect = RNMLKitRect()
    @Field
    var labels: [RNMLKitLabel] = []
    @Field
    var trackingID: Int? = nil
}

public class RNMLKitObjectDetectionObject {
    var detectedObject: Object

    init(detectedObject: Object) {
        self.detectedObject = detectedObject
    }

    var record: RNMLKitObjectDetectionObjectRecord {
        let record = RNMLKitObjectDetectionObjectRecord()
        record.frame = RNMLKitRect.fromCGRect(rect: detectedObject.frame)
        record.labels = detectedObject.labels.map { label in
            RNMLKitLabel(text: label.text, index: Int(label.index), confidence: CGFloat(label.confidence))
        }
        record.trackingID = detectedObject.trackingID as? Int
        return record
    }
}
