import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle, TextStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Icon, Button } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"
import { launchScanDocumentAsync } from "@infinitered/react-native-mlkit-document-scanner"

interface DocumentScannerScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"DocumentScanner">> {}

export const DocumentScannerScreen: FC<DocumentScannerScreenProps> = observer(
  function DocumentScannerScreen() {
    const navigation = useTypedNavigation<"ImageLabeling">()

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
