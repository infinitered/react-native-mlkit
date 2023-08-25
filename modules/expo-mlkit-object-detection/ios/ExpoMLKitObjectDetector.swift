//
//  ExpoMLKitObjectDetector.swift
//  ExpoMLKitObjectDetection
//
//  Created by Trevor Coleman on 2023-08-16.
//

import Foundation
import MLKitCommon
import MLKitObjectDetection
import ExpoMLKitCore
import MLKitObjectDetectionCustom


func getDefaultObjectDetectorOptions() -> ObjectDetectorOptions {
    let options = ObjectDetectorOptions()
    options.detectorMode = .singleImage
    options.shouldEnableMultipleObjects = false
    options.shouldEnableClassification = false
    return options;
}

public class ExpoMLKitObjectDetector: ExpoMLKitObjectDetectorCommon {
    public var name: String = "default"
    
    var nativeOptions:ObjectDetectorOptions
    
    public init(options: ExpoMLKitObjectDetectorOptions?) {
        nativeOptions = options?.objectDetectorOptions ?? getDefaultObjectDetectorOptions()
    }
    
    public func detectObjects(imagePath: String) async throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        print(" --> IMAGEPATH: \(imagePath)")
        let image = try ExpoMLKitImage(imagePath: imagePath)
        print("IMAGE \(image)")
        return try self.detectObjects(image: image)
    }
    
    public func detectObjects(image: ExpoMLKitImage) throws -> [ExpoMLKitObjectDetectionObjectRecord] {
        let objectDetector = ObjectDetector.objectDetector(options: nativeOptions)
        let visionImage = image.visionImage;
        print(visionImage.description)
        let result = try objectDetector.results(in: visionImage)
        print (result)
        return result.map({ object in
            return ExpoMLKitObjectDetectionObject(detectedObject: object).record
        })
    }
}
