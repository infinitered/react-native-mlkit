import { View } from "react-native";
import React from "react";
import { useBoundingBoxStyle, ImageScale, BoundingBox } from "../hooks";

export interface BoundingBoxProps {
  box: BoundingBox;
  scale: ImageScale;
}

export const BoundingBoxView: React.FC<BoundingBoxProps> = ({ box, scale }) => {
  const boxStyle = useBoundingBoxStyle(box, scale);
  return <View style={boxStyle} />;
};
