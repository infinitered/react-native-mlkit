import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, FlatList, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components"
import { DEMO_LIST, DemoInfo } from "./demoInfo"
import { DemoListItem } from "./components/DemoListItem"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"
import { colors } from "../../theme"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"

type HomeScreenProps = NativeStackScreenProps<AppStackScreenProps<"Home">>

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useTypedNavigation<"Home">()

  // The navigator hides the native header, so apply the safe area insets here
  // to keep content clear of the status bar, notch, and home indicator.
  const $safeAreaInsets = useSafeAreaInsetsStyle(["top", "left", "right"])

  const renderItem = React.useCallback(
    ({ item }: { item: DemoInfo }) => {
      const onPress = () => navigation.navigate(item.screen)

      return <DemoListItem demo={item} onPress={onPress} />
    },
    [navigation],
  )

  return (
    <FlatList
      ListHeaderComponent={
        <View style={$shadowSpace}>
          <View style={$titleContainer}>
            <Text preset={"heading"} text={"Infinite Red AI"} />
          </View>
        </View>
      }
      data={DEMO_LIST}
      renderItem={renderItem}
      style={[$listStyle, $safeAreaInsets]}
      contentContainerStyle={$contentContainerStyle}
    />
  )
})

const $shadowSpace: ViewStyle = {
  paddingBottom: 4,
  backgroundColor: "rgba(0,0,0,0)",
  zIndex: 1,
}

const $listStyle: ViewStyle = { backgroundColor: colors.background }

const $contentContainerStyle: ViewStyle = { paddingBottom: 100, paddingTop: 24 }

const $titleContainer: ViewStyle = {
  paddingHorizontal: 8,
  paddingTop: 16,
  paddingBottom: 8,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 1,
  backgroundColor: colors.background,
}
