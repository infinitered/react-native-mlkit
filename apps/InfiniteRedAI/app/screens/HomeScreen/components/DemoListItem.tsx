import { Text } from "~/components"
import { DemoInfo } from "../demoInfo"
import { ViewStyle, Pressable } from "react-native"
import { useAssets } from "expo-asset"
import { Image } from "expo-image"

interface DemoListItemProps {
  demo: DemoInfo
  onPress: () => void
}

const $demoItemContainer: ViewStyle = {
  margin: 8,
  paddingBottom: 16,
  paddingTop: 8,
  paddingHorizontal: 8,
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 2,
  backgroundColor: "white",
  borderRadius: 4,
}

export function DemoListItem({ demo, onPress }: DemoListItemProps) {
  const [images] = useAssets(demo.image)

  const [image] = images ?? [undefined]

  console.log({ image })

  return (
    <Pressable
      style={({ pressed }) => {
        return [$demoItemContainer, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]
      }}
      onPress={onPress}
    >
      <Text preset={"subheading"} text={demo.title} />
      <Image
        style={{ width: "100%", height: 200 }}
        source={image ? { uri: image.localUri } : undefined}
      />
      <Text text={demo.description} />
    </Pressable>
  )
}
