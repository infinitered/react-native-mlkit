import ExpoModulesCore

public struct RNMLKitRect: Record {
    public init(){}
    
    @Field
    var origin: RNMLKitPoint = RNMLKitPoint()
    @Field
    var size: RNMLKitPoint = RNMLKitPoint()

    public static func fromCGRect(rect: CGRect) -> RNMLKitRect {
        let expoRect = RNMLKitRect()

        let origin = RNMLKitPoint()
        origin.x = rect.origin.x
        origin.y = rect.origin.y
        
        let size = RNMLKitPoint()
        size.x = rect.width
        size.y = rect.height
        
        expoRect.origin = origin;
        expoRect.size = size
        
        return expoRect
    }
}
