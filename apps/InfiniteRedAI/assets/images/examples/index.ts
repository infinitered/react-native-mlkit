type ExampleImage = {
  image: number
  credit?: string
  name: string
  label: "neutral" | "sexy" | "drawing"
  hasLicensePlate: boolean
  hasFace: boolean
}

export const exampleImages = [
  {
    image: require("../../../assets/images/face-detection/kevin-seibel-oo6XOGrSyX8-unsplash.jpg"),
    credit: "Photo by Kevin Seibel on Unsplash",
    name: "kevin-seibel-oo6XOGrSyX8-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/face-detection/neom-207NEuFvjlg-unsplash.jpg"),
    credit: "Photo by NEOM on Unsplash",
    name: "neom-207NEuFvjlg-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/face-detection/denis-kirichkov-PVQcdxcFxfQ-unsplash.jpg"),
    credit: "Photo by Denis Kirichkov on Unsplash",
    name: "denis-kirichkov-PVQcdxcFxfQ-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/face-detection/stas-ostrikov-bgprFTkBIyU-unsplash.jpg"),
    credit: "Photo by Stas Ostrikov on Unsplash",
    name: "stas-ostrikov-bgprFTkBIyU-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/face-detection/justus-menke-s2OisyY9YGU-unsplash.jpg"),
    credit: "Photo by Justus Menke on Unsplash",
    name: "justus-menke-s2OisyY9YGU-unsplash",
    label: "neutral",
    licensePlate: false,
    face: true,
  },
  {
    image: require("../../../assets/images/face-detection/boxed-water-is-better-WbpsINKjB9Y-unsplash.jpg"),
    credit: "Photo by Boxed Water Is Better on Unsplash",
    name: "boxed-water-is-better-WbpsINKjB9Y-unsplash",
    label: "neutral",
    licensePlate: false,
    face: true,
  },
  {
    image: require("../../../assets/images/face-detection/nicholas-green-nPz8akkUmDI-unsplash.jpg"),
    credit: "Photo by Nicholas Green on Unsplash",
    name: "nicholas-green-nPz8akkUmDI-unsplash",
    label: "neutral",
    licensePlate: false,
    face: true,
  },
  {
    image: require("../../../assets/images/face-detection/naassom-azevedo-Q_Sei-TqSlc-unsplash.jpg"),
    credit: "Photo by Naassom Azevedo on Unsplash",
    name: "naassom-azevedo-Q_Sei-TqSlc-unsplash",
    label: "neutral",
    licensePlate: false,
    face: true,
  },
  {
    image: require("../../../assets/images/image-labeling/neutral/hiki-app-eLbOPPiDehA-unsplash.jpg"),
    credit: "Hiki App on Unsplash",
    name: "hiki-app-eLbOPPiDehA-unsplash",
    label: "neutral",
    licensePlate: false,
    face: true,
  },
  {
    image: require("../../../assets/images/image-labeling/neutral/zo-razafindramamba-8FEkr9X631Q-unsplash.jpg"),
    credit: "Zo Razafindramamba on Unsplash",
    name: "zo-razafindramamba-8FEkr9X631Q-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/image-labeling/neutral/tian-dayong-uf-h_PC2lY0-unsplash.jpg"),
    credit: "Tian Dayong on Unsplash",
    name: "tian-dayong-uf-h_PC2lY0-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/image-labeling/neutral/filippo-H2eQ2JZc4ww-unsplash.jpg"),
    credit: "Filippo on Unsplash",
    name: "filippo-H2eQ2JZc4ww-unsplash",
    label: "neutral",
    licensePlate: false,
    face: false,
  },
  {
    image: require("../../../assets/images/image-labeling/neutral/mike-cox-fj0p1NDAQHA-unsplash.jpg"),
    credit: "Mike Cox on Unsplash",
    name: "mike-cox-fj0p1NDAQHA-unsplash",
  },
]
