import {
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  ImagePickerOptions,
  MediaTypeOptions,
  ImagePickerAsset,
} from "expo-image-picker"
import { useCallback, useState, useMemo } from "react"
import { Camera } from "expo-camera"
import { useAssets, Asset } from "expo-asset"

export type UseExpoCameraImageStatus =
  | "init"
  | "noPermissions"
  | "takingPhoto"
  | "selectingPhoto"
  | "classifying"
  | "done"
  | "error"
  | "loading"

interface SelectedImage extends ImagePickerAsset {
  caption?: string
}

interface UseExpoCameraImageReturnType<T> {
  image: SelectedImage | undefined
  clearPhoto: () => void
  selectPhoto: () => Promise<void>
  takePhoto: () => Promise<void>
  randomPhoto?: (category: T) => void
  nextPhoto?: (category: T) => void
  categories?: T[]
}

export interface RandomImage {
  image: number
  credit?: string
  name: string
  tags?: string[]
}

interface ZippedImage extends RandomImage {
  asset: Asset
}

export type RandomImages = Record<string, RandomImage[]>

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 0.5,
}

export function useExpoImageAsset<
  TRandomImages extends RandomImages,
  TCategory extends keyof TRandomImages,
>(
  setStatus: (status: UseExpoCameraImageStatus) => void,
  randomPhotos?: TRandomImages,
): UseExpoCameraImageReturnType<TCategory> {
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions()
  const [image, setImage] = useState<SelectedImage | undefined>(undefined)

  const flattenedImages = useMemo(() => {
    return Object.entries(randomPhotos || {})
      .flatMap(([category, images]) => images.map((image) => ({ category, ...image })))
      .sort((a, b) => {
        if (a.category === b.category) {
          return a.image - b.image
        }
        return a.category.localeCompare(b.category) || a.image - b.image
      })
  }, [randomPhotos])

  const [assets] = useAssets(flattenedImages.map((image) => image.image)) ?? []

  const zippedImages: Record<TCategory, ZippedImage[]> = useMemo(() => {
    const result = {} as Record<TCategory, ZippedImage[]>

    Object.entries(randomPhotos || {}).forEach(([category, images]) => {
      result[category as TCategory] = images.map((image: RandomImage) => ({
        ...image,
        asset: assets?.find((asset) => asset.name === image.name) || undefined,
      }))
    })
    return result
  }, [randomPhotos, assets])

  const checkPermissions = useCallback(async () => {
    if (cameraPermission?.granted) {
      return true
    }
    setStatus("noPermissions")
    await requestCameraPermission()
    return cameraPermission.granted
  }, [cameraPermission?.granted, requestCameraPermission])

  const selectPhoto = useCallback(async () => {
    setStatus("selectingPhoto")
    const result: ImagePickerResult = await launchImageLibraryAsync(IMAGE_PICKER_OPTIONS)
    if (result.assets?.[0]) {
      setImage({ ...result.assets?.[0], localUri: result.assets?.[0].uri } as SelectedImage)
    } else {
      setImage(undefined)
    }
  }, [launchImageLibraryAsync]) // Note: Removed parentheses from launchImageLibraryAsync

  const takePhoto = useCallback(async () => {
    const hasPermissions = await checkPermissions()
    if (!hasPermissions) {
      setImage(undefined)
      return
    }
    setStatus("takingPhoto")
    const result = await launchCameraAsync(IMAGE_PICKER_OPTIONS)
    if (result.assets?.[0]) {
      setImage({ ...result.assets?.[0], localUri: result.assets?.[0].uri } as SelectedImage)
    } else {
      setImage(undefined)
    }
  }, [checkPermissions, launchCameraAsync]) // Note: Removed parentheses from launchCameraAsync

  const [currentIndexes, setCurrentIndexes] = useState<Record<TCategory, number>>(
    {} as Record<TCategory, number>,
  )

  const nextPhoto = useCallback(
    (category: TCategory) => {
      if (category in zippedImages) {
        const categoryImages = zippedImages[category]
        const currentCategoryIndex = currentIndexes[category] || 0
        const nextIndex = (currentCategoryIndex + 1) % categoryImages.length

        setCurrentIndexes((prev) => ({
          ...prev,
          [category]: nextIndex,
        }))

        const selectedImage: ZippedImage = categoryImages[currentCategoryIndex]

        setImage({
          ...selectedImage.asset,
          uri: selectedImage.asset.localUri,
          caption: selectedImage.credit,
        } as SelectedImage)
      } else {
        setImage(undefined)
      }
    },
    [zippedImages, currentIndexes],
  )

  const categories = Object.keys(randomPhotos) as TCategory[]

  const clearPhoto = useCallback(() => {
    setImage(undefined)
    setStatus("init")
  }, [])

  return {
    image,
    clearPhoto,
    selectPhoto,
    takePhoto,
    nextPhoto,
    categories,
  }
}
