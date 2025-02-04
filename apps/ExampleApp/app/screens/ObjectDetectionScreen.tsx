import React, { FC, useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, ImageStyle, Text as RNText } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon, ImageSelector } from "app/components"
import {
  RNMLKitObjectDetectionObject,
  ObjectDetectionAssetRecord,
  RNMLKitObjectDetectorOptions,
  useObjectDetectionModels,
} from "@infinitered/react-native-mlkit-object-detection"
import { BoundingBox } from "@infinitered/react-native-mlkit-core"
import { SelectedImage, UseExampleImageStatus } from "../utils/useExampleImage"
import { useTypedNavigation } from "../navigators/useTypedNavigation"

const MODELS: ObjectDetectionAssetRecord = {
  // put custom models here
}

const DEFAULT_MODEL_OPTIONS: RNMLKitObjectDetectorOptions = {
  shouldEnableMultipleObjects: true,
  shouldEnableClassification: true,
  detectorMode: "singleImage",
}

interface ObjectDetectionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"ObjectDetection">> {}

export const ObjectDetectionScreenComponent: FC<ObjectDetectionScreenProps> = observer(
  function ObjectDetectionScreen() {
    const navigation = useTypedNavigation<"ObjectDetection">()
    const {
      models: { default: objectDetectionModel },
    } = useObjectDetectionModels({
      assets: MODELS,
      loadDefaultModel: true,
      defaultModelOptions: DEFAULT_MODEL_OPTIONS,
    })

    const [image, setImage] = useState<SelectedImage | null>(null)
    const [result, setResult] = useState<RNMLKitObjectDetectionObject[]>([])
    const [boxes, setBoxes] = useState<BoundingBox[]>([])
    const [status, setStatus] = useState<
      | "init"
      | "noPermissions"
      | "done"
      | "error"
      | "loading"
      | "classifying"
      | UseExampleImageStatus
    >("init")

    const onStatusChange = useCallback(
      (status: "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus) => {
        setStatus(status)
      },
      [],
    )

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      setImage(nextImage)
    }, [])

    const processDetectionResults = useCallback(
      (detectionResults: RNMLKitObjectDetectionObject[]) => {
        setResult(detectionResults)
        setBoxes(
          detectionResults.map((r) => {
            const label = r.labels[0]
              ? `${r.labels[0]?.text} (${Math.round(r.labels[0]?.confidence * 1000) / 10}%)`
              : undefined
            return { ...r.frame, width: 2, label } as BoundingBox
          }),
        )
        setStatus("done")
      },
      [],
    )

    useEffect(() => {
      let isMounted = true

      async function runDetection() {
        if (!image?.uri || !objectDetectionModel?.isLoaded()) return

        try {
          setStatus("classifying")
          const detectionResults = await objectDetectionModel.detectObjects(image.uri)

          // Check if component is still mounted before updating state
          if (isMounted) {
            processDetectionResults(detectionResults)
          }
        } catch (error) {
          console.error("Error detecting objects:", error)
          if (isMounted) {
            setStatus("error")
          }
        }
      }

      runDetection().catch((e) => console.error("Error Running Detection", e))

      return () => {
        isMounted = false
      }
    }, [image?.uri, objectDetectionModel, processDetectionResults])

    const clearResult = useCallback(() => {
      setResult([])
      setBoxes([])
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
          return `Found ${result.length} objects`
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
          isLoading={!objectDetectionModel?.isLoaded()}
          images={{
            filter: "knownObject",
          }}
        />

        <View>
          <Text preset={"subheading"} text="Results" />
          {result?.map((r, i) => (
            <View
              key={`list-item-${r.frame.origin.x}-${r.frame.origin.y}`}
              style={[$listItem, i === result.length - 1 && $lastListItem]}
            >
              <RNText style={$itemTitle}>
                {r.labels[0] ? r.labels[0]?.text : `Item ${i + 1}`}
              </RNText>
              {Object.entries(r).map(([key, value]) => (
                <View key={`prop-${key}`} style={$itemDetails}>
                  <RNText style={[$itemDetail, $itemDetailLabel]}>{`${key}:`}</RNText>
                  <RNText style={$itemDetail}>{JSON.stringify(value)}</RNText>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Screen>
    )
  },
)

export function ObjectDetectionScreen(props: ObjectDetectionScreenProps) {
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
