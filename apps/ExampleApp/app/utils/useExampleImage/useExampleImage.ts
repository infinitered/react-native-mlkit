import {
  ImagePickerResult,
  launchCameraAsync,
  launchImageLibraryAsync,
  ImagePickerOptions,
  MediaTypeOptions,
  ImagePickerAsset,
  useCameraPermissions,
} from "expo-image-picker"
import { useCallback, useState, useMemo } from "react"
import { useAssets, Asset } from "expo-asset"
import {
  ExampleImage,
  exampleImages,
  ImageFilter,
  ImageGrouper,
  imageFilters,
  imageGroupers,
} from "./examples"

export type UseExampleImageStatus =
  | "init"
  | "noPermissions"
  | "takingPhoto"
  | "selectingPhoto"
  | "classifying"
  | "done"
  | "error"
  | "loading"

export interface SelectedImage extends ImagePickerAsset {
  caption?: string
  name?: string
}

interface UseExpoCameraImageReturnType {
  image: SelectedImage | undefined
  clearPhoto: () => void
  selectPhoto: () => Promise<void>
  takePhoto: () => Promise<void>
  randomPhoto?: (category: string) => void
  nextPhoto?: (category: string) => void
  categories?: string[]
  status: UseExampleImageStatus
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

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: false,
  quality: 0.5,
}

export function useExampleImage(predicates?: {
  filter?: ImageFilter
  groupBy?: ImageGrouper
}): UseExpoCameraImageReturnType {
  const [status, setStatus] = useState<UseExampleImageStatus>("init")
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [image, setImage] = useState<SelectedImage | undefined>(undefined)

  const filter = predicates?.filter ? imageFilters[predicates.filter] : imageFilters.sfw
  const groupBy = predicates?.groupBy ? imageGroupers[predicates.groupBy] : imageGroupers.none

  const filteredPhotos: ExampleImage[] = useMemo(() => exampleImages.filter(filter), [filter])

  const allImages = useMemo(() => {
    return exampleImages.map((image) => image.image)
  }, [])

  const [assets] = useAssets(allImages) ?? []

  const annotatedAssets: Record<string, ZippedImage[]> = useMemo(
    () =>
      filteredPhotos
        .map((image) => ({
          ...image,
          asset: assets?.find((asset) => asset.name === image.name) || undefined,
        }))
        .reduce((prev, current) => {
          const key = groupBy(current) ?? current.label
          if (key in prev) {
            prev[key].push(current as ZippedImage)
          } else {
            prev[key] = [current as ZippedImage]
          }
          return prev
        }, {} as Record<string, ZippedImage[]>),
    [filteredPhotos, assets, groupBy],
  )

  const checkPermissions = useCallback(async () => {
    if (cameraPermission?.granted) {
      return true
    }
    setStatus("noPermissions")
    await requestCameraPermission()
    return cameraPermission?.granted
  }, [cameraPermission?.granted, requestCameraPermission, setStatus])

  const selectPhoto = useCallback(async () => {
    setStatus("selectingPhoto")
    const result: ImagePickerResult = await launchImageLibraryAsync(IMAGE_PICKER_OPTIONS)
    if (result.assets?.[0]) {
      setImage({ ...result.assets?.[0], localUri: result.assets?.[0].uri } as SelectedImage)
    } else {
      setImage(undefined)
    }
  }, [setStatus]) // Note: Removed parentheses from launchImageLibraryAsync

  const categories = Object.keys(annotatedAssets) as Array<keyof typeof annotatedAssets>

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
  }, [checkPermissions, setStatus]) // Note: Removed parentheses from launchCameraAsync

  const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>(
    {} as Record<string, number>,
  )

  const nextPhoto = useCallback(
    (category: keyof typeof annotatedAssets) => {
      if (category in annotatedAssets) {
        const categoryImages = annotatedAssets[category]
        const currentCategoryIndex = currentIndexes[category] || 0
        const nextIndex = (currentCategoryIndex + 1) % categoryImages.length
        setCurrentIndexes((prev) => ({
          ...prev,
          [category]: nextIndex,
        }))
        const selectedImage: ZippedImage = categoryImages[currentCategoryIndex]
        const asset = assets?.find((asset) => asset.name === selectedImage.name)

        setImage({
          ...asset,
          uri: asset?.localUri,
          caption: selectedImage?.credit,
        } as SelectedImage)
      } else {
        setImage(undefined)
      }
    },
    [annotatedAssets, currentIndexes, assets],
  )

  const clearPhoto = useCallback(() => {
    setImage(undefined)
    setStatus("init")
  }, [setStatus])

  return useMemo(
    () => ({
      image,
      clearPhoto,
      selectPhoto,
      takePhoto,
      nextPhoto,
      categories,
      status,
    }),
    [image, clearPhoto, selectPhoto, takePhoto, nextPhoto, categories, status],
  )
}
