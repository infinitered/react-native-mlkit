import * as React from "react"
import { StyleProp, ViewStyle, Pressable, ImageStyle, TextStyle, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"
import { ImageWithBoundingBoxes, BoundingBox } from "@infinitered/react-native-mlkit-core"
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

const $caption: TextStyle = {
  marginLeft: 2,
  fontSize: 8,
  textAlign: "right",
  fontWeight: "bold",
  color: "rgba(0,0,0,0.6)",
}
const $captionContainer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  right: 8,
  backgroundColor: "rgba(255,255,255,0.6)",
  paddingHorizontal: 4,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

export interface RNMLKitImageViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  imageStyle?: ImageStyle
  image?: { localUri?: string; uri?: string; width?: number; height?: number; caption?: string }
  onPress?: () => void
  boxes?: BoundingBox[]
}

const $takePhotoText: { color: string } = { color: "rgba(0,0,0,0.2)" }

/**
 * Describe your component here
 */
export const RNMLKitImageView = observer(function RNMLKitImageView({
  image,
  onPress,
  boxes,
  style,
  imageStyle,
}: RNMLKitImageViewProps) {
  return (
    <Pressable onPress={onPress} style={[$image, $imagePlaceholder, style]}>
      {image ? (
        <>
          <ImageWithBoundingBoxes
            image={image}
            boundingBoxes={boxes}
            style={$image}
            imageStyle={imageStyle}
            contentFit={"contain"}
          />
          <View style={$captionContainer}>
            <Icon icon={"camera"} size={10} color={"rgba(0,0,0,0.9)"} />
            <Text style={$caption} text={image.caption} />
          </View>
        </>
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
