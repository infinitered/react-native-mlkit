import React, { FC, useState, useEffect, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle, ScrollView, Pressable } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Text, Icon, ImageSelector, Screen } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"

import RNMLKitBarcodeScanningModule from "@infinitered/react-native-mlkit-barcode-scanning"
import type { BarcodeScannerResult } from "@infinitered/react-native-mlkit-barcode-scanning"
import { UseExampleImageStatus, SelectedImage } from "../utils/useExampleImage"

type BarcodeScanningScreenProps = NativeStackScreenProps<AppStackScreenProps<"BarcodeScanning">>

function DebugOutput({ data }: { data: unknown }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={$debugContainer}>
      <Pressable onPress={() => setExpanded(!expanded)} style={$debugHeader}>
        <Text style={$debugTitle}>{expanded ? "▼" : "▶"} Debug Output</Text>
      </Pressable>
      {expanded && (
        <ScrollView style={$debugContent} horizontal>
          <ScrollView nestedScrollEnabled>
            <Text style={$debugText}>{JSON.stringify(data, null, 2)}</Text>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  )
}

export const BarcodeScanningScreen: FC<BarcodeScanningScreenProps> = observer(
  function BarcodeScanningScreen() {
    const navigation = useTypedNavigation<"BarcodeScanning">()

    const [image, setImage] = useState<SelectedImage | null>(null)

    const handleImageChange = useCallback((nextImage: SelectedImage) => {
      setImage(nextImage)
    }, [])

    const [result, setResult] = useState<BarcodeScannerResult | null>(null)
    const [status, setStatus] = useState<
      "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus
    >("init")

    const onStatusChange = React.useCallback(
      (status: "init" | "noPermissions" | "done" | "error" | "loading" | UseExampleImageStatus) => {
        setStatus(status)
      },
      [],
    )

    const [isScanning, setIsScanning] = useState(false)

    useEffect(() => {
      const scanBarcode = async () => {
        if (!image?.uri) return
        setIsScanning(true)
        try {
          // await RNMLKitBarcodeScanningModule.initialize()
          const scanResult = await RNMLKitBarcodeScanningModule.process(image.uri)
          setResult(scanResult)
          setStatus("done")
        } catch (error) {
          console.error("Error scanning barcode:", error)
          setStatus("error")
        } finally {
          setIsScanning(false)
        }
      }

      scanBarcode().then(() => null)
    }, [image])

    const statusMessage = React.useMemo(() => {
      if (!image && status !== "init") {
        setStatus("init")
      }
      if (isScanning) {
        return "Scanning for barcodes..."
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
          return result?.barcodes.length
            ? `Found ${result.barcodes.length} barcode${result.barcodes.length > 1 ? "s" : ""}!`
            : "No barcodes found"
        case "error":
          return "Error during scanning!"
        case "loading":
          return "Loading Example Images..."
        default:
          return ""
      }
    }, [result, image, status, isScanning])

    const clearResults = useCallback(() => {
      setResult(null)
    }, [])

    return (
      <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Barcode Scanning" />
          <Text style={$description}>Take a photo of a barcode and scan it.</Text>
        </View>
        <ImageSelector
          onImageChange={handleImageChange}
          onImageClear={clearResults}
          onStatusChange={onStatusChange}
          statusMessage={statusMessage}
          status={isScanning ? "loading" : status}
          isLoading={false}
          images={{
            filter: "all",
            groupBy: "label",
          }}
        />

        {result && result.barcodes.length > 0 && (
          <>
            <View style={$resultContainer}>
              <Text preset="subheading">Scanned Barcodes</Text>
              {result.barcodes.map((barcode, index) => (
                <View key={index} style={$barcodeItem}>
                  <Text style={$barcodeLabel}>Format: {barcode.format}</Text>
                  <Text style={$barcodeLabel}>Type: {barcode.valueType}</Text>
                  {barcode.displayValue && (
                    <Text style={$barcodeValue}>Value: {barcode.displayValue}</Text>
                  )}
                  {barcode.rawValue && barcode.rawValue !== barcode.displayValue && (
                    <Text style={$barcodeRaw}>Raw: {barcode.rawValue}</Text>
                  )}
                </View>
              ))}
            </View>
            <DebugOutput data={result} />
          </>
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
  borderColor: "rgba(0,0,0,0.2)",
  borderRadius: 8,
  padding: 12,
  marginVertical: 16,
}

const $barcodeItem: ViewStyle = {
  marginTop: 12,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: "rgba(0,0,0,0.1)",
}

const $barcodeLabel: TextStyle = {
  fontSize: 12,
  color: "rgba(0,0,0,0.6)",
  marginBottom: 4,
}

const $barcodeValue: TextStyle = {
  fontSize: 16,
  fontWeight: "600",
  marginTop: 4,
}

const $barcodeRaw: TextStyle = {
  fontSize: 12,
  fontFamily: "monospace",
  marginTop: 4,
  color: "rgba(0,0,0,0.5)",
}

const $debugContainer: ViewStyle = {
  width: "100%",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.2)",
  borderRadius: 8,
  marginBottom: 24,
  overflow: "hidden",
}

const $debugHeader: ViewStyle = {
  padding: 12,
  backgroundColor: "rgba(0,0,0,0.05)",
}

const $debugTitle: TextStyle = {
  fontWeight: "bold",
}

const $debugContent: ViewStyle = {
  maxHeight: 300,
  padding: 12,
  backgroundColor: "rgba(0,0,0,0.02)",
}

const $debugText: TextStyle = {
  fontFamily: "monospace",
  fontSize: 12,
}
