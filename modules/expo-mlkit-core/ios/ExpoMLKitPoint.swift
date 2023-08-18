import ExpoModulesCore
import MLKitVision

struct ExpoMLKitPoint:Record {
    @Field
    var x: CGFloat = 0
    @Field
    var y: CGFloat = 0
    
    static func fromVisionPoint(p:VisionPoint) -> ExpoMLKitPoint {
        let point = ExpoMLKitPoint()
        point.x = p.x
        point.y = p.y
        return point}
}
