import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ActivityIndicator } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../../navigators"
import { Screen, Text, Button, RNMLKitImageView, ScreenTitle } from "../../components"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"
import * as RNMLKitFaceDetection from "@infinitered/react-native-mlkit-face-detection"
import {
  RNMLKitFace,
  RNMLKitFaceDetectorOptionsRecord,
} from "@infinitered/react-native-mlkit-face-detection"

import { BoundingBox } from "@infinitered/react-native-mlkit-core"
import { colors } from "../../theme"
import { UseExampleImageStatus, useExampleImage } from "../../utils/useExampleImage"
import { BOX_COLORS } from "./boxColors"

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

const FACE_DETECTOR_OPTIONS: RNMLKitFaceDetectorOptionsRecord = {
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

    const [status, setStatus] = useState<"detecting" | "done" | UseExampleImageStatus>("init")
    const [boxes, setBoxes] = useState<BoundingBox[]>([])
    const facesDetected = React.useMemo(() => boxes.length, [boxes])

    const { image, clearPhoto, takePhoto, selectPhoto, nextPhoto, categories } = useExampleImage(
      setStatus,
      {
        groupBy: "face",
      },
    )

    useEffect(() => {
      ;(async () => {
        await RNMLKitFaceDetection.initialize(FACE_DETECTOR_OPTIONS)
      })()
    }, [])

    useEffect(() => {
      ;(async () => {
        if (!image?.uri) return
        setStatus("detecting")
        const faces = await RNMLKitFaceDetection.detectFaces(image?.uri ?? "")
        const boxes = faces?.faces?.map((face: RNMLKitFace, index: number) => ({
          ...face?.frame,
          width: 2,
          color: BOX_COLORS[index % BOX_COLORS.length],
        }))
        setBoxes(boxes ?? [])
        setStatus("done")
      })()
    }, [image?.uri])

    const statusMessage = React.useMemo(() => {
      const initMessage = "Take a photo or select one from your camera roll"

      if (!image && status !== "init") {
        setStatus("init")
        return initMessage
      }
      switch (status) {
        case "init":
          return initMessage
        case "noPermissions":
          return "You need to grant camera permissions to take a photo"
        case "takingPhoto":
          return "Taking photo..."
        case "selectingPhoto":
          return "Selecting photo..."
        case "done":
          return `Found ${facesDetected} faces`
        case "detecting":
          return "Detecting faces..."
        default:
          throw new Error("Invalid status")
      }
    }, [image, status, facesDetected])

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
                setBoxes([])
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
