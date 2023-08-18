import React, { FC, useEffect, useState, PropsWithChildren, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Button } from "app/components"
import { useAssets } from "expo-asset"
import {
  useObjectDetectionModels,
  ExpoMLKitObjectDetectionObject,
  useObjectDetector,
} from "@infinitered/expo-mlkit-object-detection"
import { ImageWithBoundingBoxes, BoundingBox } from "@infinitered/expo-mlkit-core"

interface ObjectDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ObjectDetection">> {}

const $container: ViewStyle = {
  width: "100%",
  aspectRatio: 1,
  position: "relative",
}
export const ObjectDetectionScreenComponent: FC<ObjectDetectionScreenProps> = observer(
  function ObjectDetectionScreen() {
    const [assets] = useAssets([require("../../assets/images/object-detection/nevada-plate.jpg")])
    const image = assets?.[0]
    const [result, setResult] = useState<ExpoMLKitObjectDetectionObject[]>([])
    const [boxes, setBoxes] = useState<BoundingBox[]>([])

    const licensePlateModel = useObjectDetector("licensePlate")

    const detectLicensePlate = useCallback(async () => {
      if (!licensePlateModel?.isLoaded()) {
        await licensePlateModel?.load()
        return
      } else {
        console.log("licensePlateModel is loaded")
      }

      if (!image?.localUri) {
        console.log("no image")
        return
      } else {
        console.log("image exists", image.name)
      }
      const result = await licensePlateModel?.detectObjects(image.localUri)
      console.log("result", result)
      setResult(result)
      setBoxes(
        result.map((r) => {
          return { ...r.frame, width: 4 }
        }),
      )
    }, [licensePlateModel, image])

    useEffect(() => {
      detectLicensePlate()
    }, [licensePlateModel, licensePlateModel?.isLoaded(), image, image?.localUri])

    return (
      <Screen style={$root} preset="scroll">
        <Text text="objectDetection" />
        <Button text={"Detect License Plate"} onPress={detectLicensePlate} />
        <View style={$container}>
          <ImageWithBoundingBoxes image={image} boundingBoxes={boxes} />
          <Text text={JSON.stringify(result, null, 2)} />
        </View>
      </Screen>
    )
  },
)

const MODELS = {
  licensePlate: {
    model: require("../../assets/models/license-plate-detection.tflite"),
  },
}

export function ObjectDetectionScreen(props: PropsWithChildren<ObjectDetectionScreenProps>) {
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    assets: MODELS,
    loadDefaultModel: true,
  })

  return (
    <ObjectDetectionModelContextProvider>
      <ObjectDetectionScreenComponent {...props} />
    </ObjectDetectionModelContextProvider>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
