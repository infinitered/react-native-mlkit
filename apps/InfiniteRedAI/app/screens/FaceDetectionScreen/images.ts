import { RandomImages } from "../../utils/useExpoImageAsset"

export const faces = [
  {
    image: require("../../../assets/images/face-detection/justus-menke-s2OisyY9YGU-unsplash.jpg"),
    credit: "Photo by Justus Menke on Unsplash",
    name: "justus-menke-s2OisyY9YGU-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/boxed-water-is-better-WbpsINKjB9Y-unsplash.jpg"),
    credit: "Photo by Boxed Water Is Better on Unsplash",
    name: "boxed-water-is-better-WbpsINKjB9Y-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/nicholas-green-nPz8akkUmDI-unsplash.jpg"),
    credit: "Photo by Nicholas Green on Unsplash",
    name: "nicholas-green-nPz8akkUmDI-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/naassom-azevedo-Q_Sei-TqSlc-unsplash.jpg"),
    credit: "Photo by Naassom Azevedo on Unsplash",
    name: "naassom-azevedo-Q_Sei-TqSlc-unsplash",
  },
]

export const noFaces = [
  {
    image: require("../../../assets/images/face-detection/kevin-seibel-oo6XOGrSyX8-unsplash.jpg"),
    credit: "Photo by Kevin Seibel on Unsplash",
    name: "kevin-seibel-oo6XOGrSyX8-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/neom-207NEuFvjlg-unsplash.jpg"),
    credit: "Photo by NEOM on Unsplash",
    name: "neom-207NEuFvjlg-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/denis-kirichkov-PVQcdxcFxfQ-unsplash.jpg"),
    credit: "Photo by Denis Kirichkov on Unsplash",
    name: "denis-kirichkov-PVQcdxcFxfQ-unsplash",
  },
  {
    image: require("../../../assets/images/face-detection/stas-ostrikov-bgprFTkBIyU-unsplash.jpg"),
    credit: "Photo by Stas Ostrikov on Unsplash",
    name: "stas-ostrikov-bgprFTkBIyU-unsplash",
  },
]

export const faceDetectionExamples = { faces, noFaces } as RandomImages
