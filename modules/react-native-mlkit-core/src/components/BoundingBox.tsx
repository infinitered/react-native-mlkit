import React from "react";
import { View, Text } from "react-native";

import { useBoundingBoxStyle, ImageScale, BoundingBox } from "../hooks";

export interface BoundingBoxProps {
  box: BoundingBox;
  scale: ImageScale;
}

export const BoundingBoxView: React.FC<BoundingBoxProps> = ({ box, scale }) => {
  const boxStyle = useBoundingBoxStyle(box, scale);
  console.log(">>> BOX LABEL:", box.label);
  return (
    <View style={boxStyle}>
      {box.label && (
        <Text
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
          {box.label}
        </Text>
      )}
    </View>
  );
};
