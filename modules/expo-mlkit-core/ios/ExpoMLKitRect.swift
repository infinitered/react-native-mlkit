import ExpoModulesCore

public struct ExpoMLKitRect: Record {
    public init(){}
    
    @Field
    var origin: ExpoMLKitPoint = ExpoMLKitPoint()
    @Field
    var size: ExpoMLKitPoint = ExpoMLKitPoint()

    public static func fromCGRect(rect: CGRect) -> ExpoMLKitRect {
        let expoRect = ExpoMLKitRect()

        let origin = ExpoMLKitPoint()
        origin.x = rect.origin.x
        origin.y = rect.origin.y
        
        let size = ExpoMLKitPoint()
        size.x = rect.width
        size.y = rect.height
        
        expoRect.origin = origin;
        expoRect.size = size
        
        return expoRect
    }
}
