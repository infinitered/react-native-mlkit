import * as React from "react"
import { StyleProp, ViewStyle, Pressable, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"
import { ImageWithBoundingBoxes, BoundingBox } from "@infinitered/expo-mlkit-core"
import { Icon } from "./Icon"

const $image: ViewStyle = { width: "100%", aspectRatio: "16/9", marginVertical: 8 }
const $imagePlaceholder: ViewStyle = {
  borderWidth: 1,
  borderTopWidth: 1,
  borderLeftWidth: 1,
  borderColor: "rgba(0,0,0,0.2)",
  borderTopColor: "rgba(0,0,0,0.4)",
  borderLeftColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 8,
  backgroundColor: "rgba(255,255,255,0.9)",
}

export interface ExpoMlKitImageViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  imageStyle?: ImageStyle
  image?: { localUri?: string; uri?: string; width?: number; height?: number }
  onPress?: () => void
  boxes?: BoundingBox[]
}

const $takePhotoText: { color: string } = { color: "rgba(0,0,0,0.2)" }

/**
 * Describe your component here
 */
export const ExpoMlKitImageView = observer(function ExpoMlKitImageView({
  image,
  onPress,
  boxes,
  style,
  imageStyle,
}: ExpoMlKitImageViewProps) {
  return (
    <Pressable onPress={onPress} style={[$image, $imagePlaceholder, style]}>
      {image ? (
        <ImageWithBoundingBoxes
          image={image}
          boundingBoxes={boxes}
          style={$image}
          imageStyle={imageStyle}
        />
      ) : (
        <>
          <Icon icon={"camera"} size={80} color={"rgba(0,0,0,0.1)"} />
          <Text style={$takePhotoText} size={"lg"}>
            Take Photo
          </Text>
        </>
      )}
    </Pressable>
  )
})
