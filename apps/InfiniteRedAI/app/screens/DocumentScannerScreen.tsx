import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Icon } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"
import { spacing } from "app/theme"

interface DocumentScannerScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"DocumentScanner">> {}

export const DocumentScannerScreen: FC<DocumentScannerScreenProps> = observer(
  function DocumentScannerScreen() {
    const navigation = useTypedNavigation<"DocumentScanner">()

    return (
      <Screen
        style={$root}
        preset="scroll"
        safeAreaEdges={["top", "bottom"]}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
      >
        <View>
          <Icon icon={"back"} onPress={() => navigation.navigate("Home")} style={$backIcon} />
          <Text preset={"heading"} text="Not available on iOS yet!" />
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
