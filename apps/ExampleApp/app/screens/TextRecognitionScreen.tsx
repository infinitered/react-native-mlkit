import React, { FC, useState, useEffect, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Text, Icon, ImageSelector, Screen } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"

import { recognizeText } from "@infinitered/react-native-mlkit-text-recognition"
import { UseExampleImageStatus, SelectedImage } from "../utils/useExampleImage"

type TextRecognitionScreenProps = NativeStackScreenProps<AppStackScreenProps<"TextRecognition">>

export const TextRecognitionScreen: FC<TextRecognitionScreenProps> = observer(
  function TextRecognitionScreen() {
    const navigation = useTypedNavigation<"TextRecognition">()

    const [image, setImage] = useState<SelectedImage | null>(null)

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      setImage(nextImage)
    }, [])

    const [result, setResult] = useState<string | null>(null)
    const [status, setStatus] = useState<
      "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus
    >("init")

    const onStatusChange = React.useCallback(
      (status: "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus) => {
        setStatus(status)
      },
      [],
    )

    useEffect(() => {
      const recognizeImage = async () => {
        if (!image?.uri) return
        setStatus("recognizing")
        try {
          const recognitionResult = await recognizeText(image.uri)
          setResult(recognitionResult)
          setStatus("done")
        } catch (error) {
          console.error("Error recognizing image:", error)
          setStatus("error")
        }
      }

      recognizeImage().then(() => null)
    }, [image])

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
          return "Done!"
        case "error":
          return "Error during recognition!"
        case "recognizing":
          return "Recognizing Image..."
        case "loading":
          return "Loading Example Images..."
        default:
          throw new Error("Invalid status")
      }
    }, [result, image, status])

    const clearResults = useCallback(() => {
      setResult(null)
    }, [])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Text Recognition" />
          <Text style={$description}>Take a photo, and extract text from it.</Text>
        </View>
        <ImageSelector
          onImageChange={handleImageChange}
          onImageClear={clearResults}
          onStatusChange={onStatusChange}
          statusMessage={statusMessage}
          status={status}
          isLoading={false}
          images={{
            filter: "all",
            groupBy: "label",
          }}
        />

        {result && (
          <View style={$resultContainer}>
            <Text>{result}</Text>
          </View>
        )}
      </Screen>
    )
  },
)

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
