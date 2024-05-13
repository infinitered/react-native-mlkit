import React from "react"
import { Text } from "~/components"
import { DemoInfo } from "../demoInfo"
import { ViewStyle, Pressable, View, ImageStyle, TextStyle } from "react-native"
import { useAssets } from "expo-asset"
import { Image } from "expo-image"
import { colors } from "../../../theme"

interface DemoListItemProps {
  demo: DemoInfo
  onPress: () => void
}

const $containerShadow: ViewStyle = {
  margin: 8,
  shadowOffset: {
    width: 2,
    height: 2,
  },
  shadowColor: "#000",
  shadowOpacity: 0.4,
  shadowRadius: 2,
}

const $demoItemContainer: ViewStyle = {
  backgroundColor: "white",
  borderRadius: 8,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.1)",
}

const $description: ViewStyle = {
  paddingHorizontal: 8,
  paddingBottom: 8,
}

const $titleContainer: ViewStyle = {
  paddingHorizontal: 8,
  marginBottom: 8,
  marginTop: 4,
}

const $image: ImageStyle = {
  width: "102%",
  height: 300,
  backgroundColor: colors.palette.accent100,
  objectFit: "cover",
}

const $title: TextStyle = {
  color: colors.palette.secondary500,
  lineHeight: 32,
}

export function DemoListItem({ demo, onPress }: DemoListItemProps) {
  const [images] = useAssets(demo.image)

  const [image] = images ?? [undefined]

  return (
    <View style={$containerShadow}>
      <Pressable
        style={({ pressed }) => {
          return [$demoItemContainer, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]
        }}
        onPress={onPress}
      >
        <Image style={$image} source={image ? { uri: image.localUri } : undefined} />
        <View style={$titleContainer}>
          <Text preset={"subheading"} text={demo.title} style={$title} />
        </View>
        <View style={$description}>
          <Text text={demo.description} />
        </View>
      </Pressable>
    </View>
  )
}
