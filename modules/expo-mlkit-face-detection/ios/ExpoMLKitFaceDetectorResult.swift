//
//  ExpoMLKitFaceDetectorResult.swift
//  ExpoMLKitFaceDetection
//
//  Created by Trevor Coleman on 2023-07-28.
//

import Foundation
import ExpoModulesCore
import MLKitFaceDetection
import MLKitVision


// Record struct to hold the raw data
struct ExpoMLKitFaceDetectionResultRecord: Record {
    @Field
    var faces: [ExpoMLKitFace] = []
    @Field
    var imagePath: String
}

// Class to provide getter for the record and easy manipulation
public class ExpoMLKitFaceDetectionResult {
    var faces: [Face]
    var imagePath: String

    init(faces: [Face], imagePath: String) {
        self.faces = faces
        self.imagePath = imagePath
    }

    var record: ExpoMLKitFaceDetectionResultRecord {
        let logger = Logger()
        let record = ExpoMLKitFaceDetectionResultRecord()
        let faces = self.faces.map { face in
            let expoFace = ExpoMLKitFace()
            expoFace.smilingProbability = face.smilingProbability
            expoFace.rightEyeOpenProbability = face.rightEyeOpenProbability
            expoFace.leftEyeOpenProbability = face.leftEyeOpenProbability
            expoFace.headEulerAngleX = CGFloat(face.headEulerAngleX)
            expoFace.headEulerAngleY = CGFloat(face.headEulerAngleY)
            expoFace.headEulerAngleZ = CGFloat(face.headEulerAngleZ)
            expoFace.trackingID = face.trackingID
            
            
            expoFace.frame = ExpoMLKitRect.fromCGRect(rect: face.frame)

            for landmark in face.landmarks {
                let expoLandmark = ExpoMLKitFaceLandmark()
                expoLandmark.type = landmark.type.rawValue
                expoLandmark.position = ExpoMLKitPoint.fromVisionPoint(p: landmark.position)
                expoFace.landmarks.append(expoLandmark)
            }

            // Assuming 'contours' is an array of FaceContour objects
            for contour in face.contours {
                let expoContour = ExpoMLKitFaceContour()
                expoContour.type = contour.type.rawValue
                expoContour.points = contour.points.map(ExpoMLKitPoint.fromVisionPoint)
                expoFace.contours.append(expoContour)
            }

            return expoFace}
        
        record.faces = faces;
        record.imagePath = self.imagePath
        return record
    }
}


struct ExpoMLKitFace: Record {
    @Field
    var frame: ExpoMLKitRect = ExpoMLKitRect()
    @Field
    var landmarks: [ExpoMLKitFaceLandmark] = []
    @Field
    var contours: [ExpoMLKitFaceContour] = []
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

struct ExpoMLKitFaceLandmark: Record {
    
    @Field
    var type: String = ""  // Use Enum to represent FaceLandmarkType
    
    @Field
    var position: ExpoMLKitPoint = ExpoMLKitPoint()
    
}

struct ExpoMLKitFaceContour:Record {
    @Field
    var type: String = ""
    @Field
    var points: [ExpoMLKitPoint] = []
}

struct ExpoMLKitPoint:Record {
    @Field
    var x: CGFloat = 0
    @Field
    var y: CGFloat = 0
    
    static func fromVisionPoint(p:VisionPoint) -> ExpoMLKitPoint {
        let point = ExpoMLKitPoint()
        point.x = p.x
        point.y = p.y
        return point}
}

struct ExpoMLKitRect: Record {
    @Field
    var origin: ExpoMLKitPoint
    @Field
    var size: ExpoMLKitPoint

    static func fromCGRect(rect: CGRect) -> ExpoMLKitRect {
        var expoRect = ExpoMLKitRect()

        var origin = ExpoMLKitPoint()
        origin.x = rect.origin.x
        origin.y = rect.origin.y
        
        var size = ExpoMLKitPoint()
        size.x = rect.width
        size.y = rect.height
        
        expoRect.origin = origin;
        expoRect.size = size
        
        return expoRect
    }
}
