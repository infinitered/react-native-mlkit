import { ExampleImage } from "./exampleImages"
import { ImageGroupPredicate } from "./filters"

const label: ImageGroupPredicate = (image: ExampleImage) => image.label
const licensePlate: ImageGroupPredicate = (image: ExampleImage) =>
  image.licensePlate ? "License Plate" : "No License Plate"
const face: ImageGroupPredicate = (image: ExampleImage) => (image.face ? "Face" : "No Face")
const none: ImageGroupPredicate = () => "Random Image"

/**
 * Groupers -- return a string to group the images by. It will become the key in the returned object.
 *
 * For example:
 * ```
 * const licensePlate = (image: ExampleImage) =>
 *  image.licensePlate ? "License Plate" : "No License Plate"
 * ```
 *  will result in an object like this:
 *  ```
 *  {
 *  "License Plate": [ExampleImage, ExampleImage, ...],
 *  "No License Plate": [ExampleImage, ExampleImage, ...],
 *  }
 *  ```
 */
export const imageGroupers = {
  label,
  licensePlate,
  face,
  none,
} as const

export type ImageGrouper = keyof typeof imageGroupers
