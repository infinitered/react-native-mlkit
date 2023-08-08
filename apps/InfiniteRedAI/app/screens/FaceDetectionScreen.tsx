import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon, Button } from "app/components"
import { useTypedNavigation } from "app/navigators/useTypedNavigation"
import { ImagePickerAsset, launchCameraAsync, MediaTypeOptions } from "expo-image-picker"
import * as ExpoMLKitFaceDetection from "@infinitered/expo-mlkit-face-detection"
import { Camera } from "expo-camera"
import { ImageWithBoundingBoxes, BoundingBox } from "@infinitered/expo-mlkit-core"
import { ExpoMLKitFace } from "@infinitered/expo-mlkit-face-detection"

interface FaceDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FaceDetection">> {}

const backIcon: { marginVertical: number } = { marginVertical: 8 }
export const FaceDetectionScreen: FC<FaceDetectionScreenProps> = observer(
  function FaceDetectionScreen() {
    const navigation = useTypedNavigation<"FaceDetection">()
    const [image, setImage] = React.useState<ImagePickerAsset | null>(null)
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [_status, setStatus] = useState<"init" | "noPermissions" | "takingPhoto" | "done">("init")
    const [boxes, setBoxes] = useState<BoundingBox[]>([])

    const takePhoto = async () => {
      setStatus("takingPhoto")

      if (!permission?.granted) {
        setStatus("noPermissions")
        await requestPermission()
      }

      if (permission?.granted) {
        setStatus("takingPhoto")
        const imagePickerResult = await launchCameraAsync({
          mediaTypes: MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.5,
          aspect: [1, 1],
        })

        if (imagePickerResult.canceled) {
          setStatus("init")
          return
        }
        console.log(imagePickerResult)
        setImage(imagePickerResult.assets[0])
        setStatus("done")
      }
    }

    const clearPhoto = () => {
      setImage(null)
    }

    useEffect(() => {
      ;(async () => {
        await ExpoMLKitFaceDetection.initialize({
          classificationMode: true,
          contourMode: true,
          isTrackingEnabled: true,
          landmarkMode: true,
          minFaceSize: 1,
          performanceMode: "accurate",
        })
      })()
    }, [])

    useEffect(() => {
      ;(async () => {
        if (!image?.uri) return
        const faces = await ExpoMLKitFaceDetection.detectFaces(image?.uri ?? "")
        console.log(faces.faces[0].frame)
        const boxes = faces?.faces?.map((face: ExpoMLKitFace, index: number) => ({
          ...face.frame,
          width: 1,
          color: BOX_COLORS[index % BOX_COLORS.length],
        }))
        console.log({ boxes })
        setBoxes(boxes ?? [])
      })()
    }, [image?.uri])

    return (
      <Screen style={$root} preset="scroll">
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={backIcon} />
          <Text preset={"heading"} text="Face Detection" />
        </View>
        <Button text={"Take Photo"} onPress={takePhoto} />
        <ImageWithBoundingBoxes
          image={image}
          style={{ width: "100%", aspectRatio: 1, borderColor: "red", borderWidth: 5 }}
          boundingBoxes={boxes}
        />
        {image && <Button text={"Clear Photo"} onPress={clearPhoto} />}
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
  "#ff08e8",
  "#ff000d",
  "#ffcf09",
  "#01f9c6",
  "#ff003f",
  "#0ff0fc",
  "#fc74fd",
  "#21fc0d",
  "#6600ff",
  "#ccff00",
  "#ff3503",
  "#ff0490",
  "#bf00ff",
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
  "#fc8427",
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
