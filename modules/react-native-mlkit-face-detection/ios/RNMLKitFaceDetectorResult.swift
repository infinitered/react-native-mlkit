//
//  RNMLKitFaceDetectorResult.swift
//  RNMLKitFaceDetection
//
//  Created by Trevor Coleman on 2023-07-28.
//

import Foundation
import ExpoModulesCore
import MLKitFaceDetection
import MLKitVision


// Record struct to hold the raw data
struct RNMLKitFaceDetectionResultRecord: Record {
    @Field
    var faces: [RNMLKitFace] = []
    @Field
    var imagePath: String
}

// Class to provide getter for the record and easy manipulation
public class RNMLKitFaceDetectionResult {
    var faces: [Face]
    var imagePath: String

    init(faces: [Face], imagePath: String) {
        self.faces = faces
        self.imagePath = imagePath
    }

    var record: RNMLKitFaceDetectionResultRecord {
        let logger = Logger()
        let record = RNMLKitFaceDetectionResultRecord()
        let faces = self.faces.map { face in
            let expoFace = RNMLKitFace()
            expoFace.smilingProbability = face.smilingProbability
            expoFace.rightEyeOpenProbability = face.rightEyeOpenProbability
            expoFace.leftEyeOpenProbability = face.leftEyeOpenProbability
            expoFace.headEulerAngleX = CGFloat(face.headEulerAngleX)
            expoFace.headEulerAngleY = CGFloat(face.headEulerAngleY)
            expoFace.headEulerAngleZ = CGFloat(face.headEulerAngleZ)
            expoFace.trackingID = face.trackingID
            
            
            expoFace.frame = RNMLKitRect.fromCGRect(rect: face.frame)

            for landmark in face.landmarks {
                let expoLandmark = RNMLKitFaceLandmark()
                expoLandmark.type = landmark.type.rawValue
                expoLandmark.position = RNMLKitPoint.fromVisionPoint(p: landmark.position)
                expoFace.landmarks.append(expoLandmark)
            }

            // Assuming 'contours' is an array of FaceContour objects
            for contour in face.contours {
                let expoContour = RNMLKitFaceContour()
                expoContour.type = contour.type.rawValue
                expoContour.points = contour.points.map(RNMLKitPoint.fromVisionPoint)
                expoFace.contours.append(expoContour)
            }

            return expoFace}
        
        record.faces = faces;
        record.imagePath = self.imagePath
        return record
    }
}


struct RNMLKitFace: Record {
    @Field
    var frame: RNMLKitRect = RNMLKitRect()
    @Field
    var landmarks: [RNMLKitFaceLandmark] = []
    @Field
    var contours: [RNMLKitFaceContour] = []
    @Field
    var trackingID: Int? = nil
    @Field
    var headEulerAngleX: CGFloat? = nil
    @Field
    var headEulerAngleY: CGFloat? = nil
    @Field
    var headEulerAngleZ: CGFloat? = nil
    @Field
    var smilingProbability: CGFloat? = nil
    @Field
    var leftEyeOpenProbability: CGFloat? = nil
    @Field
    var rightEyeOpenProbability: CGFloat? = nil
}

struct RNMLKitFaceLandmark: Record {
    
    @Field
    var type: String = ""  // Use Enum to represent FaceLandmarkType
    
    @Field
    var position: RNMLKitPoint = RNMLKitPoint()
    
}

struct RNMLKitFaceContour:Record {
    @Field
    var type: String = ""
    @Field
    var points: [RNMLKitPoint] = []
}

struct RNMLKitPoint:Record {
    @Field
    var x: CGFloat = 0
    @Field
    var y: CGFloat = 0
    
    static func fromVisionPoint(p:VisionPoint) -> RNMLKitPoint {
        let point = RNMLKitPoint()
        point.x = p.x
        point.y = p.y
        return point}
}

struct RNMLKitRect: Record {
    @Field
    var origin: RNMLKitPoint
    @Field
    var size: RNMLKitPoint

    static func fromCGRect(rect: CGRect) -> RNMLKitRect {
        var expoRect = RNMLKitRect()

        var origin = RNMLKitPoint()
        origin.x = rect.origin.x
        origin.y = rect.origin.y
        
        var size = RNMLKitPoint()
        size.x = rect.width
        size.y = rect.height
        
        expoRect.origin = origin;
        expoRect.size = size
        
        return expoRect
    }
}
