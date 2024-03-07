import React, { FC, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Icon, Button, ImageSelector } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"
import { launchScanDocumentAsync } from "@infinitered/react-native-mlkit-document-scanner"
import { UseExampleImageStatus, SelectedImage } from "app/utils/useExampleImage"

interface DocumentScannerScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"DocumentScanner">> {}

export const DocumentScannerScreen: FC<DocumentScannerScreenProps> = observer(
  function DocumentScannerScreen() {
    const navigation = useTypedNavigation<"ImageLabeling">()

    const [image, setImage] = useState<SelectedImage | null>(null)

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      console.log("handleImageChange", nextImage)
      setImage(nextImage)
    }, [])

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
        // case "done":
        //   return bestGuess.toLowerCase() === "porn" ? "🚫 NSFW" : "✅ SFW"
        case "error":
          return "Error during classification!"
        case "classifying":
          return "Classifying Image..."
        case "loading":
          return "Loading Example Images..."
        default:
          throw new Error("Invalid status")
      }
    }, [image, status])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Document Scanner" />
          <Text style={$description}>Directions TBD</Text>

          <Button
            onPress={async () => {
              const result = await launchScanDocumentAsync({ pageLimit: 1 })
              console.log(result)
            }}
            text="Scan Document"
          />
        </View>
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
