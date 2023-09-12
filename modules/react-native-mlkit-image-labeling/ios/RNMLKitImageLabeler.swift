//
//  ImageLabelingClassifier.swift
//  RNMLKit
//
//  Created by Trevor Coleman on 2023-07-13.
//

import Foundation
import ExpoModulesCore
import MLKitCommon
import MLKitImageLabelingCustom
import MLKitVision
import RNMLKitCore

let ERROR_DOMAIN:String = "red.infinite.react-native-mlkit.ImageLabelerErrorDomain"

/**
 Basic options for the image labeler
 */
public struct RNMLKitImageLabelerOptions {
    public var confidenceThreshold: Float?
    public var maxResultCount: Int?

    init(confidenceThreshold: Float? = nil, maxResultCount: Int? = nil) {
        self.confidenceThreshold = confidenceThreshold
        self.maxResultCount = maxResultCount
    }
}

enum RNMLKitImageLabelerError:Error {
    /// The model was not found at the specified modelPath
    case modelDoesNotExist(modelPath:String)
    /// There was an error while processing the image
    case processingImageFailed(message:String, imagePath:String)
    /// The labels array returned by the imageLabeller was nil or empty
    case labellerReturnedNoLabels(imagePage:String)
}


public class RNMLKitImageLabeler {

    private var model:LocalModel;
    private var customImageLabelerOptions:CustomImageLabelerOptions;
    private var imageLabeler:ImageLabeler
    private var logger:Logger

    /**
     Returns a new RNMLKitImageLabeler
      - parameter context: An `RNMLKitContext` object, allows for dependency injection from the main module
      - parameter modelPath: The absolute local path the model file (get this from `useAssets()` on the JS side
      - parameter options:
     */
    init(context:RNMLKitContext, modelPath:String, options:RNMLKitImageLabelerOptions? = nil) throws {
        logger=context.logger;


        // create model
        model = LocalModel(path:modelPath)

        // set default options if none provided
        customImageLabelerOptions = CustomImageLabelerOptions(localModel: model)

        let threshold = options?.confidenceThreshold
        if let actualThreshold = threshold {
            customImageLabelerOptions.confidenceThreshold = NSNumber(value: actualThreshold)
        } else {
            customImageLabelerOptions.confidenceThreshold = nil
        }

        customImageLabelerOptions.maxResultCount = options?.maxResultCount ?? 10

        imageLabeler = ImageLabeler.imageLabeler(options: self.customImageLabelerOptions)
    }

    public struct Result {
        var text: String
        var confidence:Float
        var index: Int
        func toExpoRecord () {

        }
    }

    public func classifyImage(imagePath:String) async throws -> [Result] {
        // convert image to relevant image class
        let image = try RNMLKitImage(imagePath: imagePath)

        return try await self.classifyImage(image: image)
    }

    public func classifyImage(image: RNMLKitImage) async throws -> [Result] {


        var labels: [ImageLabel]

        // run the inference

        labels = try await imageLabeler.process(image.visionImage)

        var results: [Result] = []
        for label in labels {
            let result = Result(
              text: label.text,
              confidence: label.confidence,
              index: label.index
            )
            results.append(result)
        }

        return results
    }


    public func setOptions(options: RNMLKitImageLabelerOptions) {
        let threshold = options.confidenceThreshold
        if let actualThreshold = threshold {
            customImageLabelerOptions.confidenceThreshold = NSNumber(value: actualThreshold)
        } else {
            customImageLabelerOptions.confidenceThreshold = nil
        }
        customImageLabelerOptions.maxResultCount = options.maxResultCount ?? 10
    }

}
