import React, { FC, useEffect, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../../navigators"
import { Screen, Text, Button, RNMLKitImageView, ScreenTitle } from "../../components"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"
import { colors } from "../../theme"
import { useExampleImage } from "../../utils/useExampleImage"
import { BOX_COLORS } from "./boxColors"
import { useFaceDetector } from "@infinitered/react-native-mlkit-face-detection"

interface FaceDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FaceDetection">> {}

const $button: ViewStyle = { backgroundColor: colors.palette.accent300, marginVertical: 8 }
const $rowButton: ViewStyle = { flexGrow: 1, marginHorizontal: 2 }

const $statusMessage: TextStyle = {
  color: "rgba(0,0,0,0.6)",
}
const $status: ViewStyle = {
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const $photoButton: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
}

const FACE_DETECTOR_OPTIONS = {
  classificationMode: true,
  contourMode: true,
  isTrackingEnabled: true,
  landmarkMode: true,
  minFaceSize: 0.001,
  performanceMode: "accurate",
}

export const FaceDetectionScreen: FC<FaceDetectionScreenProps> = observer(
  function FaceDetectionScreen() {
    const navigation = useTypedNavigation<"FaceDetection">()

    const { image, clearPhoto, takePhoto, selectPhoto, nextPhoto, categories } = useExampleImage(
      undefined,
      {
        groupBy: "face",
      },
    )

    const {
      clearFaces,
      detectFaces,
      error,
      state: faceDetectionState,
      faces,
    } = useFaceDetector(FACE_DETECTOR_OPTIONS)

    useEffect(() => {
      if (image?.uri) {
        detectFaces(image.uri)
      }
    }, [image?.uri])

    const boxes = useMemo(
      () =>
        faces.map((face, index) => ({
          ...face.frame,
          width: 2,
          color: BOX_COLORS[index % BOX_COLORS.length],
        })),
      [faces],
    )

    const statusMessage = useMemo(() => {
      switch (faceDetectionState) {
        case "init":
        case "modelLoading":
          return "Initializing..."
        case "ready":
          return "Take a photo or select one from your camera roll"
        case "detecting":
          return "Detecting faces..."
        case "done":
          return `Found ${faces.length} faces`
        case "error":
          return error || "An error occurred"
        default:
          throw new Error("Invalid status")
      }
    }, [faceDetectionState, faces.length, error])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <ScreenTitle
          goBack={() => navigation.goBack()}
          heading={"Face Detection"}
          description={
            "Take a photo, or select one from your camera roll to detect faces using MLKit."
          }
        />
        <RNMLKitImageView image={image} onPress={image ? clearPhoto : takePhoto} boxes={boxes} />
        <View style={$status}>
          {status === "detecting" ? (
            <ActivityIndicator />
          ) : (
            <Text style={$statusMessage}>{statusMessage}</Text>
          )}
        </View>
        {image ? (
          <Button text={"Clear Photo"} onPress={clearPhoto} style={$button} />
        ) : (
          <Button text={"Select Photo"} onPress={selectPhoto} style={$button} />
        )}
        <View style={$photoButton}>
          {categories.map((category) => (
            <Button
              key={category}
              text={category}
              onPress={() => {
                clearPhoto()
                clearFaces()
                nextPhoto(category)
              }}
              style={[$button, $rowButton]}
            />
          ))}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
}
