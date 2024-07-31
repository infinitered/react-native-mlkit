import React, { FC, useState, useEffect, PropsWithChildren, useMemo, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Icon, ImageSelector } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"

import {
  useModels,
  useImageLabeler,
  ClassificationResult,
} from "@infinitered/react-native-mlkit-image-labeling"
import { UseExampleImageStatus, SelectedImage } from "../utils/useExampleImage"

interface ImageLabelingScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ImageLabeling">> {}

const MODELS = {
  nsfw: {
    model: require("assets/models/nsfwjs-quant-mobilenet.tflite"),
    options: {
      maxResultCount: 5,
      confidenceThreshold: 0,
    },
  },
}

const ImageLabelingScreenComponent: FC<ImageLabelingScreenProps> = observer(
  function ImageLabelingScreen() {
    const navigation = useTypedNavigation<"ImageLabeling">()

    const [image, setImage] = useState<SelectedImage | null>(null)

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      console.log("handleImageChange", nextImage)
      setImage(nextImage)
    }, [])

    const model = useImageLabeler("nsfw")
    const [result, setResult] = useState<ClassificationResult | null>(null)
    const [status, setStatus] = useState<
      "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus
    >("init")

    const onStatusChange = React.useCallback(
      (status: "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus) => {
        console.log("status", status)
        setStatus(status)
      },
      [],
    )

    useEffect(() => {
      const classifyImage = async () => {
        if (!image?.uri || !model) return
        console.log("CLASSIFYING:", image.name)
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

      classifyImage()
    }, [image, model])

    const bestGuess = useMemo(() => {
      if (result && result.length > 0) {
        const bestResult = result.reduce((prev, current) => {
          return current.confidence > prev.confidence ? current : prev
        })
        return bestResult.text
      }
      return ""
    }, [result])

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
          return bestGuess.toLowerCase() === "porn" ? "🚫 NSFW" : "✅ SFW"
        case "error":
          return "Error during classification!"
        case "classifying":
          return "Classifying Image..."
        case "loading":
          return "Loading Example Images..."
        default:
          throw new Error("Invalid status")
      }
    }, [bestGuess, image, status])

    const clearResults = useCallback(() => {
      setResult(null)
    }, [])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Image Labeling" />
          <Text style={$description}>Take a photo, and find out if it is 🚫NSFW.</Text>
        </View>
        <ImageSelector
          onImageChange={handleImageChange}
          onImageClear={clearResults}
          onStatusChange={onStatusChange}
          statusMessage={statusMessage}
          status={status}
          isLoading={!model?.isLoaded()}
          images={{
            filter: "all",
            groupBy: "label",
          }}
        />

        {result && (
          <View style={$resultContainer}>
            {result.map((item) => {
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
        )}
      </Screen>
    )
  },
)

export function ImageLabelingScreen(props: PropsWithChildren<ImageLabelingScreenProps>) {
  const { ObjectDetectionModelContextProvider } = useModels(MODELS)

  return (
    <ObjectDetectionModelContextProvider>
      <ImageLabelingScreenComponent {...props} />
    </ObjectDetectionModelContextProvider>
  )
}

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
  display: "flex",
  flexDirection: "column",
}
const $backIcon: ImageStyle = { marginVertical: 8 }

const $description: TextStyle = {
  marginVertical: 8,
  color: "rgba(0,0,0,0.6)",
}

const $resultContainer: ViewStyle = {
  width: "100%",
  borderWidth: 1,
  marginVertical: 24,
}
const $resultRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 8,
}
const $resultText: ViewStyle = { flex: 1 }
const $resultBarContainer: ViewStyle = {
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
