//
//  RNMLKitObjectDetector.swift
//  RNMLKitObjectDetection
//
//  Created by Trevor Coleman on 2023-08-16.
//

import Foundation
import MLKitCommon
import MLKitObjectDetection
import RNMLKitCore
import MLKitObjectDetectionCustom


func getDefaultObjectDetectorOptions() -> ObjectDetectorOptions {
    let options = ObjectDetectorOptions()
    options.detectorMode = .singleImage
    options.shouldEnableMultipleObjects = false
    options.shouldEnableClassification = false
    return options;
}

public class RNMLKitObjectDetector: RNMLKitObjectDetectorCommon {
    public var name: String = "default"

    var nativeOptions:ObjectDetectorOptions

    public init(options: RNMLKitObjectDetectorOptions?) {
        nativeOptions = options?.objectDetectorOptions ?? getDefaultObjectDetectorOptions()
    }

    public func detectObjects(imagePath: String) async throws -> [RNMLKitObjectDetectionObjectRecord] {
        print(" --> IMAGEPATH: \(imagePath)")
        let image = try RNMLKitImage(imagePath: imagePath)
        print("IMAGE \(image)")
        return try self.detectObjects(image: image)
    }

    public func detectObjects(image: RNMLKitImage) throws -> [RNMLKitObjectDetectionObjectRecord] {
        let objectDetector = ObjectDetector.objectDetector(options: nativeOptions)
        let visionImage = image.visionImage;
        print(visionImage.description)
        let result = try objectDetector.results(in: visionImage)
        print (result)
        return result.map({ object in
            return RNMLKitObjectDetectionObject(detectedObject: object).record
        })
    }
}
