import React, { FC, useEffect, useState, PropsWithChildren, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ImageStyle, Text as RNText } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon, ImageSelector } from "app/components"
import {
  useObjectDetectionModels,
  RNMLKitObjectDetectionObject,
  useObjectDetector,
  AssetRecord,
  RNMLKitObjectDetectorOptions,
} from "@infinitered/react-native-mlkit-object-detection"
import { BoundingBox } from "@infinitered/react-native-mlkit-core"
import { SelectedImage, UseExampleImageStatus } from "../utils/useExampleImage"
import { useTypedNavigation } from "../navigators/useTypedNavigation"

interface ObjectDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ObjectDetection">> {}

export const ObjectDetectionScreenComponent: FC<ObjectDetectionScreenProps> = observer(
  function ObjectDetectionScreen() {
    const navigation = useTypedNavigation<"ObjectDetection">()

    const [image, setImage] = useState<SelectedImage | null>(null)
    const [result, setResult] = useState<RNMLKitObjectDetectionObject[]>([])
    const [boxes, setBoxes] = useState<BoundingBox[]>([])
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

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      console.log("handleImageChange", nextImage)
      setImage(nextImage)
    }, [])

    const licensePlateModel = useObjectDetector("default")

    const detectLicensePlate = useCallback(async () => {
      if (!licensePlateModel?.isLoaded()) {
        await licensePlateModel?.load()
      } else {
        console.log("licensePlateModel is loaded")
      }

      if (!image?.uri) {
        console.log("No Image or Image has no URI")
        return
      }

      const result = await licensePlateModel?.detectObjects(image?.uri)
      console.log("result", result?.[0]?.frame)
      setResult(result)
      setBoxes(
        result.map((r) => {
          const label = r.labels[0]
            ? `${r.labels[0]?.text} (${Math.round(r.labels[0]?.confidence * 1000) / 10}%)`
            : undefined
          return { ...r.frame, width: 2, label } as BoundingBox
        }),
      )
    }, [licensePlateModel, image])

    useEffect(() => {
      detectLicensePlate()
    }, [licensePlateModel, image, image?.uri, detectLicensePlate])

    const clearResult = useCallback(() => {
      setResult([])
    }, [])

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
          return `Found ${result.length} license plates`
        case "error":
          return "Error during classification!"
        case "classifying":
          return "Detecting Objects..."
        case "loading":
          return "Loading Example Images..."
        default:
          throw new Error("Invalid status")
      }
    }, [image, result?.length, status])

    return (
      <Screen style={$root} preset="scroll">
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Object Detection" />
          <Text style={$description}>Detect Objects</Text>
        </View>
        <ImageSelector
          boundingBoxes={boxes}
          onImageChange={handleImageChange}
          onImageClear={clearResult}
          onStatusChange={onStatusChange}
          statusMessage={statusMessage}
          status={status}
          isLoading={!licensePlateModel?.isLoaded()}
          images={{
            filter: "knownObject",
          }}
        />
        <View>
          <Text preset={"subheading"} text="Results" />
          {result?.map((r, i) => {
            return (
              <View
                key={`list-item-${r.frame.origin.x}-${r.frame.origin.y}`}
                style={[$listItem, i === result.length - 1 && $lastListItem]}
              >
                <RNText style={$itemTitle}>
                  {r.labels[0] ? r.labels[0]?.text : `Item ${i + 1}`}
                </RNText>
                {Object.entries(r).map(([key, value]) => {
                  return (
                    <View key={`prop-${key}`} style={$itemDetails}>
                      <RNText style={[$itemDetail, $itemDetailLabel]}>{`${key}:`}</RNText>
                      <RNText key={`prop-${key}`} style={$itemDetail}>
                        {JSON.stringify(value)}
                      </RNText>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </Screen>
    )
  },
)

const $itemTitle: TextStyle = { fontWeight: "bold" }
const $itemDetails: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}
const $itemDetail: TextStyle = { fontWeight: "200", paddingLeft: 8 }
const $itemDetailLabel: TextStyle = { fontWeight: "normal" }
const $listItem: ViewStyle = {
  padding: 8,
  display: "flex",
  flexDirection: "column",
  borderBottomWidth: 1,
  borderColor: "rgba(0,0,0,0.2)",
}
const $lastListItem: ViewStyle = { borderBottomWidth: 0 }

const MODELS: AssetRecord = {
  licensePlate: {
    model: require("../../assets/models/license-plate-detection.tflite"),
    options: {
      shouldEnableMultipleObjects: false,
      shouldEnableClassification: false,
      detectorMode: "singleImage",
    },
  },
}

const DEFAULT_MODEL_OPTIONS: RNMLKitObjectDetectorOptions = {
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: true,
  detectorMode: "singleImage",
}

export function ObjectDetectionScreen(props: PropsWithChildren<ObjectDetectionScreenProps>) {
  const { ObjectDetectionModelContextProvider } = useObjectDetectionModels({
    assets: MODELS,
    loadDefaultModel: true,
    defaultModelOptions: DEFAULT_MODEL_OPTIONS,
  })

  return (
    <ObjectDetectionModelContextProvider>
      <ObjectDetectionScreenComponent {...props} />
    </ObjectDetectionModelContextProvider>
  )
}

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 8,
}

const $description: TextStyle = {
  marginVertical: 8,
  color: "rgba(0,0,0,0.6)",
}

const $backIcon: ImageStyle = { marginVertical: 8 }
