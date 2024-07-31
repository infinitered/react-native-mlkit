import React, { FC, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "~/navigators"
import { Screen, Text, Button, RNMLKitImageView, ScreenTitle } from "~/components"
import { useTypedNavigation } from "~/navigators/useTypedNavigation"
import { colors } from "~/theme"
import { useExampleImage } from "~/utils/useExampleImage"
import { BOX_COLORS } from "~/screens"
import { BoundingBox } from "@infinitered/react-native-mlkit-core"
import {
  useFacesInPhoto,
  RNMLKitFaceDetectionContextProvider,
} from "@infinitered/react-native-mlkit-face-detection"

interface FaceDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FaceDetection">> {}

const $button: ViewStyle = { backgroundColor: colors.palette.accent300, marginVertical: 8 }

const $statusMessage: TextStyle = {
  color: "rgba(0,0,0,0.6)",
}
const $status: ViewStyle = {
  height: 50,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const FaceDetectionScreenComponent: FC<FaceDetectionScreenProps> = observer(
  function FaceDetectionScreen() {
    const navigation = useTypedNavigation<"FaceDetection">()

    const { image, clearPhoto, takePhoto, selectPhoto } = useExampleImage()

    const {
      faces,
      clearFaces,
      status: faceDetectorStatus,
      error: faceDetectorError,
    } = useFacesInPhoto(image?.uri)
    const boxes = useMemo(() => {
      return faces.map((face, index) => {
        return {
          ...face.frame,
          color: BOX_COLORS[index % BOX_COLORS.length],
          width: 2,
        } as BoundingBox
      })
    }, [faces])

    const statusMessage = useMemo(() => {
      switch (faceDetectorStatus) {
        case "init":
        case "modelLoading":
          return "Initializing Face Detection Model..."
        case "ready":
          return "Take a photo or select one from your camera roll"
        case "detecting":
          return "Detecting faces..."
        case "done":
          return `Found ${faces.length} faces`
        case "error":
          return faceDetectorError || "An error occurred"
        default:
          throw new Error("Invalid status")
      }
    }, [faceDetectorStatus, faces.length, faceDetectorError])

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
          {faceDetectorStatus === "detecting" ? (
            <ActivityIndicator />
          ) : (
            <Text style={$statusMessage}>{statusMessage}</Text>
          )}
        </View>
        {image ? (
          <Button
            text={"Clear Photo"}
            onPress={() => {
              clearFaces()
              clearPhoto()
            }}
            style={$button}
          />
        ) : (
          <Button text={"Select Photo"} onPress={selectPhoto} style={$button} />
        )}
      </Screen>
    )
  },
)

const FACE_DETECTOR_OPTIONS = {
  classificationMode: true,
  contourMode: true,
  isTrackingEnabled: true,
  landmarkMode: false,
  minFaceSize: 0.001,
  performanceMode: "accurate",
}

export function FaceDetectionScreen(props: FaceDetectionScreenProps) {
  return (
    <RNMLKitFaceDetectionContextProvider options={FACE_DETECTOR_OPTIONS}>
      <FaceDetectionScreenComponent {...props} />
    </RNMLKitFaceDetectionContextProvider>
  )
}

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
}
