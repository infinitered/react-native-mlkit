import React from "react";
import { View, Text } from "react-native";

import { useBoundingBoxStyle, ImageScale, BoundingBox } from "../hooks";

export interface BoundingBoxProps {
  box: BoundingBox;
  scale: ImageScale;
  testId?: string;
}

export const BoundingBoxView: React.FC<BoundingBoxProps> = ({
  box,
  scale,
  testId,
}) => {
  const boxStyle = useBoundingBoxStyle(box, scale);
  const {
    origin: { x, y },
    size: { x: w, y: h },
    label,
  } = box;
  const newTestId = `${testId}--boundingBox--x${x}y${y}-w${w}h${h}`;
  return (
    <View style={boxStyle} testID={newTestId}>
      {box.label && (
        <Text
          testID={`${testId}-text`}
          style={{
            backgroundColor: boxStyle?.borderColor ?? "magenta",
            fontSize: 8,
            color: "white",
            position: "relative",
            top: -8,
            left: -2,
            lineHeight: 10,
            height: 10,
            width: boxStyle?.width,
            paddingHorizontal: 2,
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};
