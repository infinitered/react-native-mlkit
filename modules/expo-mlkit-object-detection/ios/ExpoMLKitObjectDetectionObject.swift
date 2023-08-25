import Foundation
import ExpoModulesCore
import ExpoMLKitCore
import MLKitObjectDetectionCommon
import ExpoMLKitCore

public struct ExpoMLKitObjectDetectionObjectRecord: Record {
    public init() {  }
    
    @Field
    var frame: ExpoMLKitRect = ExpoMLKitRect()
    @Field
    var labels: [ExpoMLKitLabel] = []
    @Field
    var trackingID: Int? = nil
}

public class ExpoMLKitObjectDetectionObject {
    var detectedObject: Object

    init(detectedObject: Object) {
        self.detectedObject = detectedObject
    }

    var record: ExpoMLKitObjectDetectionObjectRecord {
        let record = ExpoMLKitObjectDetectionObjectRecord()
        record.frame = ExpoMLKitRect.fromCGRect(rect: detectedObject.frame)
        record.labels = detectedObject.labels.map { label in
            ExpoMLKitLabel(text: label.text, index: Int(label.index), confidence: CGFloat(label.confidence))
        }
        record.trackingID = detectedObject.trackingID as? Int
        return record
    }
}



