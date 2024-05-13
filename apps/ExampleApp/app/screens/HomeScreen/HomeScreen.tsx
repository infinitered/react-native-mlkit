import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, FlatList, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { DEMO_LIST, DemoInfo } from "./demoInfo"
import { DemoListItem } from "./components/DemoListItem"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"
import { colors } from "../../theme"

type HomeScreenProps = NativeStackScreenProps<AppStackScreenProps<"Home">>

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useTypedNavigation<"Home">()

  const renderItem = React.useCallback(
    ({ item }: { item: DemoInfo }) => {
      const onPress = () => navigation.navigate(item.screen)

      return <DemoListItem demo={item} onPress={onPress} />
    },
    [navigation],
  )
  return (
    <Screen style={$root} preset="fixed">
      <View style={$shadowSpace}>
        <View style={$titleContainer}>
          <Text preset={"heading"} text={"Infinite Red AI"} />
        </View>
      </View>
      <View style={$listContainer}>
        <FlatList
          data={DEMO_LIST}
          renderItem={renderItem}
          contentContainerStyle={$contentContainerStyle}
        />
      </View>
    </Screen>
  )
})

const $shadowSpace: ViewStyle = {
  paddingBottom: 4,
  backgroundColor: "rgba(0,0,0,0)",
  zIndex: 1,
}

const $root: ViewStyle = {
  flex: 1,
}

const $listContainer: ViewStyle = {
  paddingHorizontal: 8,
  position: "relative",
  top: -32,
  marginTop: 16,
}

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
