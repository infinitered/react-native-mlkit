//
//  RNMLKitFaceDetector.swift
//  RNMLKitFaceDetection
//
//  Created by Trevor Coleman on 2023-07-28.
//

import Foundation
import MLKitFaceDetection
import RNMLKitCore

enum RNMLKitFaceDetectorError:Error {
    /// The model was not found at the specified modelPath
    case detectorNotInitialized
    case classificationError(error:Error)
}

class RNMLKitFaceDetector {
    var faceDetector: FaceDetector?

    init(
        options: RNMLKitFaceDetectorOptions
    ) {
        self.setOptions(options: options)

        return
    }

    func setOptions(
        options:RNMLKitFaceDetectorOptions
    ) {
        self.faceDetector = FaceDetector.faceDetector(options: options.options)
    }

    func detectFaces(image: RNMLKitImage) async throws -> RNMLKitFaceDetectionResult {
        guard let faceDetector = self.faceDetector else {
            throw RNMLKitFaceDetectorError.detectorNotInitialized
        }

        do {
            let faces: [Face] = try await faceDetector.process(image.visionImage)
            return RNMLKitFaceDetectionResult(faces: faces, imagePath: image.imageURL.absoluteString)
        } catch {
            throw RNMLKitFaceDetectorError.classificationError(error: error)
        }
    }

}
