import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import {
  Screen,
  Text,
  Icon,
  Button,
  ListItem,
  TextField,
  Toggle,
  RNMLKitImageView,
} from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"
import {
  ResultFormatOptions,
  ScannerModeOptions,
  launchDocumentScannerAsync,
} from "@infinitered/react-native-mlkit-document-scanner"
import { spacing } from "app/theme"

interface DocumentScannerScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"DocumentScanner">> {}

export const DocumentScannerScreen: FC<DocumentScannerScreenProps> = observer(
  function DocumentScannerScreen() {
    const navigation = useTypedNavigation<"DocumentScanner">()
    const [result, setResult] = React.useState<string>("")
    const [imageToShow, setImageToShow] = React.useState<string>("")
    const [allowGallery, setAllowGallery] = React.useState<boolean>(false)
    const [mode, setMode] = React.useState<ScannerModeOptions>(ScannerModeOptions.FULL)
    const [resultFormat, setResultFormat] = React.useState<ResultFormatOptions>(
      ResultFormatOptions.ALL,
    )
    const [pageLimit, setPageLimit] = React.useState<number>(1)

    return (
      <Screen
        style={$root}
        preset="scroll"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
      >
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Document Scanner" />
          <Text style={$description}>
            Configure scanner options and tap `Scan Document` to launch the modal
          </Text>

          <View style={{ gap: spacing.lg }}>
            <ListItem
              text="Page Limit"
              textStyle={$optionText}
              RightComponent={
                <TextField
                  value={pageLimit.toString()}
                  onChangeText={(text) => {
                    // parse string to int and make sure if not or less than 1, set to 1
                    const num = parseInt(text)
                    setPageLimit(isNaN(num) || num < 1 ? 1 : num)
                  }}
                  containerStyle={$pageLimit}
                  textAlign="right"
                />
              }
            />
            <ListItem
              text="Allow Gallery Import"
              textStyle={$optionText}
              RightComponent={
                <Toggle
                  variant="switch"
                  value={allowGallery}
                  onPress={() => setAllowGallery(!allowGallery)}
                  containerStyle={$centerSwitch}
                />
              }
            />
            <ListItem
              text="Mode"
              textStyle={$optionText}
              RightComponent={
                <View style={$radioCol}>
                  <Toggle
                    variant="radio"
                    value={mode === ScannerModeOptions.BASE}
                    label="Base"
                    onPress={() => setMode(ScannerModeOptions.BASE)}
                  />
                  <Toggle
                    variant="radio"
                    value={mode === ScannerModeOptions.BASE_WITH_FILTER}
                    label="Base w/ Filter"
                    onPress={() => setMode(ScannerModeOptions.BASE_WITH_FILTER)}
                  />
                  <Toggle
                    variant="radio"
                    value={mode === ScannerModeOptions.FULL}
                    label="Full"
                    onPress={() => setMode(ScannerModeOptions.FULL)}
                  />
                </View>
              }
            />
            <ListItem
              text="Result Formats"
              textStyle={$optionText}
              RightComponent={
                <View style={$radioCol}>
                  <Toggle
                    variant="radio"
                    value={resultFormat === ResultFormatOptions.ALL}
                    label="All"
                    onPress={() => setResultFormat(ResultFormatOptions.ALL)}
                  />
                  <Toggle
                    variant="radio"
                    value={resultFormat === ResultFormatOptions.PDF}
                    label="PDF"
                    onPress={() => setResultFormat(ResultFormatOptions.PDF)}
                  />
                  <Toggle
                    variant="radio"
                    value={resultFormat === ResultFormatOptions.JPEG}
                    label="JPEG"
                    onPress={() => setResultFormat(ResultFormatOptions.JPEG)}
                  />
                </View>
              }
            />

            <Button
              onPress={async () => {
                const result = await launchDocumentScannerAsync({
                  pageLimit,
                  galleryImportAllowed: allowGallery,
                  resultFormats: resultFormat,
                  scannerMode: mode,
                })
                setResult(JSON.stringify(result))
                if (result.pages !== undefined && result.pages.length > 0) {
                  setImageToShow(result.pages[0])
                }
              }}
              text="Scan Document"
            />
          </View>
        </View>

        <Text style={$description}>Result: {result}</Text>

        {imageToShow !== "" && <RNMLKitImageView image={{ uri: imageToShow }} />}
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

const $optionText: TextStyle = {
  alignSelf: "flex-start",
  fontWeight: "bold",
}

const $radioCol: ViewStyle = {
  width: "50%",
  gap: spacing.md,
}

const $centerSwitch: ViewStyle = { alignSelf: "center" }

const $pageLimit: ViewStyle = { flex: 1 }
