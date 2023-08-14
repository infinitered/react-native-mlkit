import React, { FC, useState, useCallback, useEffect, PropsWithChildren } from "react"
import { Image } from "expo-image"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, Pressable, TextStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../../navigators"
import { Screen, Text, Icon, Button } from "../../components"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"
import {
  ImagePickerAsset,
  launchCameraAsync,
  MediaTypeOptions,
  launchImageLibraryAsync,
  ImagePickerResult,
  ImagePickerOptions,
} from "expo-image-picker"

import { Camera } from "expo-camera"

import { colors } from "../../theme"

import { useRandomImages, RandomImageLabel } from "./images"
import {
  useModels,
  useImageLabeler,
  ClassificationResult,
} from "@infinitered/expo-mlkit-image-labeling"

interface ImageLabelingScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ImageLabeling">> {}

const $backIcon: ImageStyle = { marginVertical: 8 }
const $squareImage: ImageStyle = { width: "100%", aspectRatio: "16 / 9", marginVertical: 8 }

const $imagePlaceholder: ViewStyle = {
  borderWidth: 1,
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderColor: "rgba(0,0,0,0.2)",
  borderTopColor: "rgba(0,0,0,0.4)",
  borderLeftColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 8,
  backgroundColor: "rgba(255,255,255,0.9)",
}
const $button: ViewStyle = { backgroundColor: colors.palette.accent300, marginVertical: 8 }
const $rowButton: ViewStyle = { flexGrow: 1 }

const $description: TextStyle = {
  marginVertical: 8,
  color: "rgba(0,0,0,0.6)",
}
const $statusMessage: TextStyle = {
  color: "rgba(0,0,0,0.6)",
}
const $status: ViewStyle = {
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 0.5,
  aspect: [1, 1],
}
const $takePhoto: TextStyle = { color: "rgba(0,0,0,0.2)" }

const MODELS = {
  nsfw: {
    model: require("../../../assets/models/nsfwjs.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0,
    },
  },
}
const $randomImageButtons: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
}
const ImageLabelingScreenComponent: FC<ImageLabelingScreenProps> = observer(
  function ImageLabelingScreen() {
    const navigation = useTypedNavigation<"ImageLabeling">()
    const [image, setImage] = React.useState<ImagePickerAsset | null>(null)

    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions()
    const [status, setStatus] = useState<
      | "init"
      | "noPermissions"
      | "takingPhoto"
      | "selectingPhoto"
      | "classifying"
      | "done"
      | "error"
      | "loading"
    >("init")

    const { getRandomImageOfType, imageTypes } = useRandomImages()

    const getPhoto = useCallback(
      async (source: "camera" | "library" | RandomImageLabel) => {
        setStatus("takingPhoto")

        let result: ImagePickerResult | undefined

        switch (source) {
          case "camera":
            if (!cameraPermission?.granted) {
              setStatus("noPermissions")
              await requestCameraPermission()
            }
            if (cameraPermission?.granted) {
              setStatus("takingPhoto")
              result = await launchCameraAsync(IMAGE_PICKER_OPTIONS)
            }
            break
          case "library":
            setStatus("selectingPhoto")
            result = await launchImageLibraryAsync(IMAGE_PICKER_OPTIONS)
            break
          case "sexy":
          case "neutral":
          case "drawing":
            result = getRandomImageOfType(source)
            break
          default:
            throw new Error("Invalid source")
        }

        if (!result || result.canceled) {
          setStatus("init")
          return
        }

        setImage(result.assets[0])
        setStatus("done")
      },
      [cameraPermission?.granted, getRandomImageOfType, requestCameraPermission],
    )

    const model = useImageLabeler("nsfw")
    const [result, setResult] = useState<ClassificationResult | null>(null)

    const classifyImage = async () => {
      if (!image?.uri || !model) return

      setStatus("classifying")
      try {
        const classificationResult = await model.classifyImage(image.uri)
        setResult(classificationResult)
        setStatus("done")
      } catch (error) {
        console.error("Error classifying image:", error)
        setStatus("error")
      }
    }

    useEffect(() => {
      classifyImage()
    }, [image, model])

    const clearPhoto = () => {
      setImage(null)
      setStatus("init")
    }

    const statusMessage = React.useMemo(() => {
      if (!image && status !== "init") {
        setStatus("init")
      }
      switch (status) {
        case "init":
          return "Take a photo or select one from your camera roll"
        case "noPermissions":
          return "You need to grant camera permissions to take a photo"
        case "takingPhoto":
          return "Taking photo..."
        case "selectingPhoto":
          return "Selecting photo..."
        case "done":
          return `Classification Complete`
        case "error":
          return "Error during classification!"
        case "classifying":
          return "Classifying Image..."
        default:
          throw new Error("Invalid status")
      }
    }, [status])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Image Labeling" />
          <Text style={$description}>Take a photo, and find out if it is 🚫NSFW.</Text>
        </View>

        {image ? (
          <View style={[$squareImage, $imagePlaceholder]}>
            <Image contentFit={"contain"} source={image} style={$squareImage} />
          </View>
        ) : (
          <Pressable onPress={() => getPhoto("camera")} style={[$squareImage, $imagePlaceholder]}>
            <Icon icon={"camera"} size={80} color={"rgba(0,0,0,0.1)"} />
            <Text style={$takePhoto} size={"lg"}>
              Take Photo
            </Text>
          </Pressable>
        )}
        <View style={$status}>
          {status === "classifying" ? (
            <ActivityIndicator />
          ) : (
            <Text style={$statusMessage}>{statusMessage}</Text>
          )}
        </View>
        <View style={{ width: "100%", height: 200, borderWidth: 1 }}>
          {result &&
            result.map((item) => {
              console.log(item)
              return (
                <View
                  key={item.text}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 8,
                  }}
                >
                  <Text style={{ flex: 1 }} text={item.text} />
                  <View
                    style={{
                      flex: 3,
                      height: 20,
                    }}
                  >
                    <View
                      style={{
                        height: 20,
                        width: `${item.confidence * 100}%`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(255,0,255,1)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    />
                    <View
                      style={{
                        flex: 3,
                        height: 20,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    />
                  </View>
                </View>
              )
            })}
        </View>
        {image ? (
          <Button text={"Clear Photo"} onPress={clearPhoto} style={$button} />
        ) : (
          <Button text={"Select Photo"} onPress={() => getPhoto("library")} style={$button} />
        )}
        <View style={$randomImageButtons}>
          {imageTypes.map((type) => (
            <Button
              key={`${type}-button`}
              text={`Random ${type}`}
              onPress={async () => {
                clearPhoto()
                await getPhoto(type)
              }}
              style={[$button, $rowButton, { marginHorizontal: 2 }]}
            />
          ))}
        </View>
      </Screen>
    )
  },
)

export function ImageLabelingScreen(props: PropsWithChildren<ImageLabelingScreenProps>) {
  const { ModelContextProvider } = useModels(MODELS)

  return (
    <ModelContextProvider>
      <ImageLabelingScreenComponent {...props} />
    </ModelContextProvider>
  )
}

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
  display: "flex",
  flexDirection: "column",
}
