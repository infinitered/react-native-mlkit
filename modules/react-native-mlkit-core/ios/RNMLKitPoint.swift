import ExpoModulesCore
import MLKitVision

struct RNMLKitPoint:Record {
    @Field
    var x: CGFloat = 0
    @Field
    var y: CGFloat = 0
    
    static func fromVisionPoint(p:VisionPoint) -> RNMLKitPoint {
        let point = RNMLKitPoint()
        point.x = p.x
        point.y = p.y
        return point}
}
