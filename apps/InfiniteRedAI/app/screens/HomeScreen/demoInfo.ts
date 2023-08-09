import { AppStackParamList } from "../../navigators"

export interface DemoInfo {
  title: string
  description: string
  screen: keyof AppStackParamList
  image?: number
}

const FACE_DETECTION = require("../../../assets/images/face-detection.jpg")

// List of available demos as a typescript object
export const DEMO_LIST: DemoInfo[] = [
  {
    title: "Face Detection",
    description: "Detect faces in a photo, using ML Kit",
    screen: "FaceDetection",
    image: FACE_DETECTION,
  },
  {
    title: "Face Detection",
    description: "Detect faces in a photo, using ML Kit",
    screen: "FaceDetection",
    image: FACE_DETECTION,
  },
  {
    title: "Face Detection",
    description: "Detect faces in a photo, using ML Kit",
    screen: "FaceDetection",
    image: FACE_DETECTION,
  },
]
