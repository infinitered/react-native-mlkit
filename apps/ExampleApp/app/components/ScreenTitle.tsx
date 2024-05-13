import * as React from "react"
import { TextStyle, View, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "~/components/Text"
import { Icon } from "./Icon"

export interface ScreenTitleProps {
  goBack?: () => void
  heading: string
  description: string
}

export const ScreenTitle = observer(function ScreenTitle({
  goBack,
  heading,
  description,
}: ScreenTitleProps) {
  return (
    <View>
      <Icon icon={"back"} onPress={goBack} style={$backIcon} />
      <Text preset={"heading"} text={heading} />
      <Text style={$description} text={description} />
    </View>
  )
})

const $backIcon: ImageStyle = { marginVertical: 8 }
const $description: TextStyle = {
  marginVertical: 8,
  color: "rgba(0,0,0,0.6)",
}
