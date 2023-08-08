import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, FlatList, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { DEMO_LIST, DemoInfo } from "./demoInfo"
import { DemoListItem } from "./components/DemoListItem"
import { useTypedNavigation } from "../../navigators/useTypedNavigation"

interface HomeScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Home">> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useTypedNavigation<"Home">()

  const renderItem = React.useCallback(({ item }: { item: DemoInfo }) => {
    const onPress = () => navigation.navigate(item.screen)

    return <DemoListItem demo={item} onPress={onPress} />
  }, [])
  return (
    <Screen style={$root} preset="fixed">
      <Text preset={"heading"} text={"Infinite Red AI"} />
      <View>
        <FlatList data={DEMO_LIST} renderItem={renderItem} />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 16,
}
