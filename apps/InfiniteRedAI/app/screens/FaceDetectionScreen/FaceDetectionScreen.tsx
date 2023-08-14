import React, { FC, useState, useEffect } from "react"
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
import * as ExpoMLKitFaceDetection from "@infinitered/expo-mlkit-face-detection"
import { ExpoMLKitFace } from "@infinitered/expo-mlkit-face-detection"

import { Camera, CameraType } from "expo-camera"
import { ImageWithBoundingBoxes, BoundingBox } from "@infinitered/expo-mlkit-core"
import { colors } from "../../theme"
import { useAssets } from "expo-asset"
import { FACES, NO_FACES } from "./images"

interface FaceDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FaceDetection">> {}

const $backIcon: ImageStyle = { marginVertical: 8 }
const $squareImage: ViewStyle = { width: "100%", aspectRatio: 1, marginVertical: 8 }
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

export const FaceDetectionScreen: FC<FaceDetectionScreenProps> = observer(
  function FaceDetectionScreen() {
    const navigation = useTypedNavigation<"FaceDetection">()
    const [image, setImage] = React.useState<ImagePickerAsset | null>(null)

    const [randomFaces] = useAssets(FACES.map((face) => face.image))
    const [randomNoFaces] = useAssets(NO_FACES.map((face) => face.image))
    const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions()
    const [status, setStatus] = useState<
      "init" | "noPermissions" | "takingPhoto" | "selectingPhoto" | "detecting" | "done"
    >("init")
    const [boxes, setBoxes] = useState<BoundingBox[]>([])
    const facesDetected = React.useMemo(() => boxes.length, [boxes])
    const [faceNumber, setFaceNumber] = useState({ face: 0, noFace: 0 })

    const getRandom = (noFace?: boolean) => {
      const number = noFace ? faceNumber.noFace : faceNumber.face

      const faces = noFace ? randomNoFaces : randomFaces

      const randomImage = faces?.[number]
      setFaceNumber({
        face: noFace ? faceNumber.face : (faceNumber.face + 1) % randomFaces?.length,
        noFace: noFace ? (faceNumber.noFace + 1) % randomNoFaces?.length : faceNumber.noFace,
      })
      return {
        assets: [
          {
            ...randomImage,
            type: "image",
            uri: randomImage?.localUri,
          } as ImagePickerAsset,
        ],
      } as ImagePickerResult
    }

    const getPhoto = React.useCallback(
      async (source: "camera" | "library" | "face" | "no-face") => {
        setStatus("takingPhoto")

        let result: ImagePickerResult | undefined
        setBoxes([])

        switch (source) {
          case "camera":
            if (!cameraPermission?.granted) {
              setStatus("noPermissions")
              await requestCameraPermission()
            }
            if (cameraPermission?.granted) {
              setStatus("takingPhoto")
              result = await launchCameraAsync({
                cameraType: CameraType.front,
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.5,
                aspect: [1, 1],
              } as ImagePickerOptions)
            }
            break
          case "library":
            setStatus("selectingPhoto")
            result = await launchImageLibraryAsync({
              mediaTypes: MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.5,
              aspect: [1, 1],
            })
            break
          case "face":
            result = getRandom()
            break
          case "no-face":
            result = getRandom(true)
            break
        }

        if (!result || result.canceled) {
          setStatus("init")
          return
        }

        setImage(result.assets[0])
        setStatus("done")
      },
      [faceNumber, randomFaces, randomNoFaces, cameraPermission, requestCameraPermission],
    )

    const clearPhoto = () => {
      setImage(null)
      setStatus("init")
    }

    useEffect(() => {
      ;(async () => {
        await ExpoMLKitFaceDetection.initialize({
          classificationMode: true,
          contourMode: true,
          isTrackingEnabled: true,
          landmarkMode: true,
          minFaceSize: 0.01,
          performanceMode: "accurate",
        })
      })()
    }, [])

    useEffect(() => {
      ;(async () => {
        if (!image?.uri) return
        setStatus("detecting")
        const faces = await ExpoMLKitFaceDetection.detectFaces(image?.uri ?? "")
        const boxes = faces?.faces?.map((face: ExpoMLKitFace, index: number) => ({
          ...face?.frame,
          width: 2,
          color: BOX_COLORS[index % BOX_COLORS.length],
        }))
        setBoxes(boxes ?? [])
        console.log("done -->", image?.uri)
        setStatus("done")
      })()
    }, [image?.uri])

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
          return `Found ${facesDetected} faces`
        case "detecting":
          return "Detecting faces..."
        default:
          throw new Error("Invalid status")
      }
    }, [status, facesDetected])

    console.log({ image })

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Face Detection" />
          <Text style={$description}>
            Take a photo, or select one from your camera roll to detect faces using MLKit.
          </Text>
        </View>

        {image ? (
          <View style={[$squareImage, $imagePlaceholder]}>
            <ImageWithBoundingBoxes image={image} boundingBoxes={boxes} style={$squareImage} />
          </View>
        ) : (
          <Pressable onPress={() => getPhoto("camera")} style={[$squareImage, $imagePlaceholder]}>
            <Icon icon={"camera"} size={80} color={"rgba(0,0,0,0.1)"} />
            <Text style={{ color: "rgba(0,0,0,0.2)" }} size={"lg"}>
              Take Photo
            </Text>
          </Pressable>
        )}
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
          <Button text={"Select Photo"} onPress={() => getPhoto("library")} style={$button} />
        )}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
          <Button
            text={"Random Face"}
            onPress={async () => {
              clearPhoto()
              await getPhoto("face")
            }}
            style={[$button, $rowButton, { marginEnd: 4 }]}
          />
          <Button
            text={"Random NoFace"}
            onPress={async () => {
              clearPhoto()
              await getPhoto("no-face")
            }}
            style={[$button, $rowButton, { marginStart: 4 }]}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
}
const BOX_COLORS = [
  "#dfff11",
  "#66ff00",
  "#01f9c6",
  "#ff08e8",
  "#ffcf09",
  "#bf00ff",
  "#ff003f",
  "#ff6611",
  "#0ff0fc",
  "#fc74fd",
  "#ff000d",
  "#21fc0d",
  "#6600ff",
  "#ccff00",
  "#ff3503",
  "#ff0490",
  "#e60000",
  "#55ffff",
  "#8f00f1",
  "#fffc00",
  "#be03fd",
  "#08ff08",
  "#fe01b1",
  "#ffcf00",
  "#fe1493",
  "#ff5555",
  "#00fdff",
  "#ccff02",
  "#ff11ff",
  "#04d9ff",
  "#ff9933",
  "#fe4164",
  "#39ff14",
  "#fe019a",
  "#bc13fe",
  "#ff073a",
  "#cfff04",
  "#ff0055",
]
