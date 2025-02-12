import { Image, ImageStyle, ImageSource } from "expo-image";
import React, { useMemo } from "react";
import { View, ViewStyle, DimensionValue } from "react-native";

import { BoundingBoxView } from "./BoundingBoxView";
import { useLayout, useImageScale, ContentFit, BoundingBox } from "../hooks";

interface ImageWithBoundingBoxesProps {
  image?: {
    localUri?: string | null;
    uri?: string | null;
    width?: number | null;
    height?: number | null;
  };
  boundingBoxes?: BoundingBox[];
  style?: ViewStyle | ViewStyle[];
  contentFit?: Exclude<ContentFit, "cover">;
  imageStyle?: ImageStyle;
  testId?: string;
}

export function ImageWithBoundingBoxes({
  image,
  boundingBoxes = [],
  style,
  imageStyle,
  contentFit = "contain",
  testId,
}: ImageWithBoundingBoxesProps) {
  const [containerLayout, onLayout] = useLayout();
  const scaleFactor = useImageScale(contentFit, containerLayout, image);
  const localUri = image?.localUri ?? image?.uri ?? undefined;

  const imageSource = useMemo(() => {
    return localUri
      ? ({
          uri: localUri,
          width: image?.width,
          height: image?.height,
        } as ImageSource)
      : undefined;
  }, [localUri]);

  const imageDimensions: {
    width: DimensionValue;
    height: DimensionValue;
    left?: DimensionValue;
    top?: DimensionValue;
  } = React.useMemo(() => {
    if (!image?.width || !image?.height) {
      return { width: "100%", height: "100%" };
    }

    const scaledWidth = image.width * scaleFactor.x;
    const scaledHeight = image.height * scaleFactor.y;

    return {
      width: scaledWidth,
      height: scaledHeight,
      left: (containerLayout.width - scaledWidth) / 2,
      top: (containerLayout.height - scaledHeight) / 2,
      position: "absolute" as const,
    };
  }, [image, scaleFactor, containerLayout]);

  return (
    <View style={[$container, style]} onLayout={onLayout} testID={testId}>
      <Image
        testID={`${testId}-image`}
        source={imageSource}
        style={[imageDimensions, imageStyle ?? {}]}
        contentFit={contentFit}
      />
      {boundingBoxes.map((box, index) => (
        <BoundingBoxView
          box={box}
          scale={{
            ...scaleFactor,
            offsetX: imageDimensions.left as number,
            offsetY: imageDimensions.top as number,
          }}
          key={index}
          testId={`${testId}-boundingBoxView`}
        />
      ))}
    </View>
  );
}

const $container: ViewStyle = {
  position: "relative",
  overflow: "hidden",
};
