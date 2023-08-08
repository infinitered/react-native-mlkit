//
//  ExpoMLKitFaceDetector.swift
//  ExpoMLKitFaceDetection
//
//  Created by Trevor Coleman on 2023-07-28.
//

import Foundation
import MLKitFaceDetection
import ExpoMLKitCore

enum ExpoMLKitFaceDetectorError:Error {
    /// The model was not found at the specified modelPath
    case detectorNotInitialized
    case classificationError(error:Error)
}

class ExpoMLKitFaceDetector {
    var faceDetector: FaceDetector?

    init(
        options: ExpoMLKitFaceDetectorOptions
    ) {
        self.setOptions(options: options)

        return
    }

    func setOptions(
        options:ExpoMLKitFaceDetectorOptions
    ) {
        self.faceDetector = FaceDetector.faceDetector(options: options.options)
    }

    func detectFaces(image: ExpoMLKitImage) async throws -> ExpoMLKitFaceDetectionResult {
        guard let faceDetector = self.faceDetector else {
            throw ExpoMLKitFaceDetectorError.detectorNotInitialized
        }

        do {
            let faces: [Face] = try await faceDetector.process(image.visionImage)
            return ExpoMLKitFaceDetectionResult(faces: faces, imagePath: image.imageURL.absoluteString)
        } catch {
            throw ExpoMLKitFaceDetectorError.classificationError(error: error)
        }
    }

}
