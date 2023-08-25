import Foundation
import ExpoModulesCore

public struct ExpoMLKitLabel:Record {
    @Field
    var text: String = ""
    @Field
    var index: Int = 0
    @Field
    var confidence:CGFloat=0
    
    public init(text: String, index: Int, confidence: CGFloat) {
        self.text = text
        self.index = index
        self.confidence = confidence
    }
    
    public init() {}
}
