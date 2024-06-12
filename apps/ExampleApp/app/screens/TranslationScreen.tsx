import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ImageStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text, Icon } from "../components"
import { useTypedNavigation } from "../navigators/useTypedNavigation"
import { spacing } from "app/theme"
import { listModelsAsync } from "@infinitered/react-native-mlkit-translation"

interface TranslationScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"Translation">> {}

export const TranslationScreen: FC<TranslationScreenProps> = observer(function TranslationScreen() {
  const navigation = useTypedNavigation<"Translation">()

  const doStuff = React.useCallback(async () => {
    //   const result = await MLKitTranslation.translateText({
    //     text: "Hello, how are you?",
    //     from: "en",
    //     to: "es",
    //   })
    //   console.log(result)
    // }
    try {
      const models = listModelsAsync()
      console.log("models", models)
      // const languages = listLanguages()
      // console.log("languages", languages)
    } catch (e) {
      console.error(e)
    }
  }, [])

  React.useEffect(() => {
    doStuff()
  }, [doStuff])

  console.log("test")

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
})

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
  display: "flex",
  flexDirection: "column",
}

const $backIcon: ImageStyle = { marginVertical: 8 }
