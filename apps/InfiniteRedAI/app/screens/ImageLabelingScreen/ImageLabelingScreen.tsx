import React, { FC, useState, useEffect, PropsWithChildren } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../../navigators"
import { Screen, Text, Icon, Button, ExpoMlKitImageView } from "../../components"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"

import { colors } from "../../theme"

import { imageLabelerExamples } from "./images"
import {
  useModels,
  useImageLabeler,
  ClassificationResult,
} from "@infinitered/expo-mlkit-image-labeling"
import { useExpoImageAsset, UseExpoCameraImageStatus } from "../../utils/useExpoImageAsset"

interface ImageLabelingScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ImageLabeling">> {}

const $backIcon: ImageStyle = { marginVertical: 8 }
const $button: ViewStyle = { backgroundColor: colors.palette.accent300, marginVertical: 8 }
const $rowButton: ViewStyle = { flexGrow: 1, marginHorizontal: 2 }

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
const $resultContainer: { borderWidth: number; width: string; height: number } = {
  width: "100%",
  height: 200,
  borderWidth: 1,
}
const $resultRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 8,
}
const $resultText: ViewStyle = { flex: 1 }
const $resultBarContainer: { flex: number; height: number } = {
  flex: 3,
  height: 20,
}
const $resultBar: ViewStyle = {
  height: 20,
  position: "absolute",
  top: 0,
  left: 0,
  backgroundColor: "rgba(255,0,255,1)",
  borderRadius: 4,
  overflow: "hidden",
}
const $resultBarBackground: ViewStyle = {
  flex: 3,
  height: 20,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderRadius: 4,
  overflow: "hidden",
}
const ImageLabelingScreenComponent: FC<ImageLabelingScreenProps> = observer(
  function ImageLabelingScreen() {
    const navigation = useTypedNavigation<"ImageLabeling">()
    const [status, setStatus] = useState<
      "init" | "noPermissions" | "done" | "error" | "loading" | UseExpoCameraImageStatus
    >("init")

    const { image, takePhoto, selectPhoto, randomPhoto, clearPhoto, categories } =
      useExpoImageAsset(setStatus, imageLabelerExamples)

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

        <ExpoMlKitImageView image={image} onPress={image ? clearPhoto : takePhoto} />
        <View style={$status}>
          {status === "classifying" ? (
            <ActivityIndicator />
          ) : (
            <Text style={$statusMessage}>{statusMessage}</Text>
          )}
        </View>
        <View style={$resultContainer}>
          {result &&
            result.map((item) => {
              return (
                <View key={item.text} style={$resultRow}>
                  <Text style={$resultText} text={item.text} />
                  <View style={$resultBarContainer}>
                    <View style={[$resultBar, { width: `${item.confidence * 100}%` }]} />
                    <View style={$resultBarBackground} />
                  </View>
                </View>
              )
            })}
        </View>
        {image ? (
          <Button text={"Clear Photo"} onPress={clearPhoto} style={$button} />
        ) : (
          <Button text={"Select Photo"} onPress={selectPhoto} style={$button} />
        )}
        <View style={$randomImageButtons}>
          {categories.map((type) => (
            <Button
              key={`${type}-button`}
              text={`Random ${type}`}
              onPress={async () => {
                clearPhoto()
                randomPhoto(type)
              }}
              style={[$button, $rowButton]}
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
