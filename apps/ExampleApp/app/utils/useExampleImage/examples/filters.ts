import { ExampleImage } from "./exampleImages"

type ImageFilterPredicate = (image: ExampleImage) => boolean
export type ImageGroupPredicate = (image: ExampleImage) => string
const all: ImageFilterPredicate = () => true
const sfw: ImageFilterPredicate = (image: ExampleImage) => image.label !== "borderline-sfw"
const knownObject: ImageFilterPredicate = (image: ExampleImage) => image.knownObject ?? false
/**
 * Filters -- return true to keep the image, false to remove it.
 */
export const imageFilters = {
  all,
  sfw,
  knownObject,
} as const
export type ImageFilter = keyof typeof imageFilters
