import { useMemo } from "react";
import { ViewStyle } from "react-native";

import { ImageScale } from "./useImageScale";
import { RNMLKitPoint } from "../types";

const DEFAULT_SCALE: ImageScale = {
  x: 1,
  y: 1,
  offsetX: 0,
  offsetY: 0,
};
/**
 * Calculates the style object for a bounding box based on the provided parameters.
 *
 * @param {BoundingBox} box - The bounding box object containing size, origin, color, and width information.
 * @param {ImageScale} [scale] - The scale object specifying the scaling factors and offsets.
 * @returns {ViewStyle | undefined} - The calculated style object or undefined if the box is invalid.
 */
export const useBoundingBoxStyle = (
  box: BoundingBox,
  { x: scaleX, y: scaleY, offsetX, offsetY }: ImageScale = DEFAULT_SCALE
): ViewStyle | undefined => {
  return useMemo((): ViewStyle | undefined => {
    // Check if the box has valid size and origin properties
    if (!box?.size || !box?.origin) return undefined;

    // Calculate the style object based on the box properties, scaleFactor, and offset
    return {
      height: box.size.y * scaleY,
      width: box.size.x * scaleX,
      borderColor: box.color ?? "magenta",
      borderWidth: box.width ?? 1,
      position: "absolute",
      top: box.origin.y * scaleY + (offsetY ?? 0) - (box.width ?? 0),
      left: box.origin.x * scaleX + (offsetX ?? 0) - (box.width ?? 0),
    };
  }, [box, scaleX, scaleY, offsetX, offsetY]);
};

/**
 * Represents a bounding box with origin, size, color, label, and width properties.
 */
export interface BoundingBox {
  origin: RNMLKitPoint;
  size: RNMLKitPoint;
  color?: string;
  label?: string;
  width?: number;
}
