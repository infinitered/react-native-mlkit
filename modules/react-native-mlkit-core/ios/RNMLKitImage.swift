import Foundation
import MLKitVision

public enum RNMLKitImageError: Error {
    case invalidImageURL(imagePath: String)
    case couldNotLoadImage(imagePath: String)
}

public class RNMLKitImage {
    public var imageURL: URL
    public var uiImage: UIImage
    public var visionImage: VisionImage

    public init(imagePath: String) throws {
        guard let imageURL = URL(string: imagePath) else {
            throw RNMLKitImageError.invalidImageURL(imagePath: imagePath)
        }

        self.imageURL = imageURL

        guard let originalUIImage = UIImage(contentsOfFile: imageURL.path) else {
            throw RNMLKitImageError.couldNotLoadImage(imagePath: imageURL.path)
        }

        self.uiImage = originalUIImage.fixedOrientation() // Normalize orientation

        self.visionImage = VisionImage(image: self.uiImage)
        self.visionImage.orientation = .up // Now it's always properly oriented
    }
}

// Helper extension to fix UIImage orientation
extension UIImage {
    func fixedOrientation() -> UIImage {
        if self.imageOrientation == .up {
            return self // No need to fix
        }

        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        self.draw(in: CGRect(origin: .zero, size: self.size))
        let normalizedImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        return normalizedImage ?? self
    }
}
