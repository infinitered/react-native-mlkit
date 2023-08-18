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
    options.shouldEnableMultipleObjects = true
    options.shouldEnableClassification = true
    return options;
}

public class ExpoMLKitObjectDetector: ExpoMLKitObjectDetectorCommon {
    public init(options: ExpoMLKitObjectDetectorOptions?) {
        let nativeOptions = options?.objectDetectorOptions ?? getDefaultObjectDetectorOptions()
        let objectDetector = ObjectDetector.objectDetector(options: nativeOptions)
        super.init(name: "default", objectDetector: objectDetector)
    }
}
