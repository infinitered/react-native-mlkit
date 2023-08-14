import { useAssets } from "expo-asset"
import { ImagePickerAsset, ImagePickerResult } from "expo-image-picker"
import { useState, useMemo } from "react"

export const NEUTRAL = [
  {
    image: require("../../../assets/images/face-detection/justus-menke-s2OisyY9YGU-unsplash.jpg"),
    credit: "Photo by Justus Menke on Unsplash",
  },
]

export const SEXY = [
  {
    image: require("../../../assets/images/face-detection/justus-menke-s2OisyY9YGU-unsplash.jpg"),
    credit: "Photo by Justus Menke on Unsplash",
  },
]

export const DRAWING = [
  {
    image: require("../../../assets/images/face-detection/justus-menke-s2OisyY9YGU-unsplash.jpg"),
    credit: "Photo by Justus Menke on Unsplash",
  },
]

export type RandomImageLabel = "neutral" | "sexy" | "drawing" | "porn" | "hentai"

export function useRandomImages() {
  const [neutralImages] = useAssets(NEUTRAL.map((face) => face.image))
  const [drawingImages] = useAssets(DRAWING.map((face) => face.image))
  const [sexyImages] = useAssets(SEXY.map((face) => face.image))

  const [imageIndexes, setImageIndexes] = useState({ neutral: 0, drawing: 0, sexy: 0 })

  const images = useMemo(
    () =>
      ({
        neutral: neutralImages,
        drawing: drawingImages,
        sexy: sexyImages,
      } as Record<RandomImageLabel, typeof neutralImages>),
    [neutralImages, drawingImages, sexyImages],
  )

  const getRandomImageOfType = (imageType?: RandomImageLabel) => {
    const number = imageIndexes[imageType]
    const imageSet = images[imageType]

    const randomImage = imageSet?.[number]
    setImageIndexes({
      ...imageIndexes,
      [imageType]: number + 1,
    })

    return {
      assets: [
        {
          ...randomImage,
          type: "image",
          uri: randomImage?.localUri,
        } as ImagePickerAsset,
      ],
    } as ImagePickerResult
  }

  return { getRandomImageOfType, imageTypes: Object.keys(images) as RandomImageLabel[] }
}
