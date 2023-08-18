import { AppStackParamList } from "../../navigators"

export interface DemoInfo {
  title: string
  description: string
  screen: keyof AppStackParamList
  image?: number
}

const FACE_DETECTION = require("../../../assets/images/face-detection.jpg")
const FACE_HOLDER = require("../../../assets/images/welcome-face.png")

// List of available demos as a typescript object
export const DEMO_LIST: DemoInfo[] = [
  {
    title: "Object Detection",
    description: "Detect objects",
    screen: "ObjectDetection",
    image: FACE_HOLDER,
  },
  {
    title: "Face Detection",
    description: "Detect faces in a photo, using ML Kit",
    screen: "FaceDetection",
    image: FACE_DETECTION,
  },
  {
    title: "Image Labeling with NSFWjs",
    description: "Detect NSFW Images",
    screen: "ImageLabeling",
    image: FACE_HOLDER,
  },
]
