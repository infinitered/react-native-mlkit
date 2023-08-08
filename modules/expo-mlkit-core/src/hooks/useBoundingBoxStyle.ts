import { useMemo } from "react";

import { ViewStyle } from "react-native";
import { ImageScale } from "./useImageScale";

/**
 * Calculates the style object for a bounding box based on the provided parameters.
 *
 * @param {BoundingBox} box - The bounding box object containing size, origin, color, and width information.
 * @param {ImageScale} [scale] - The scale object specifying the scaling factors and offsets.
 * @returns {ViewStyle | undefined} - The calculated style object or undefined if the box is invalid.
 */
export const useBoundingBoxStyle = (
  box: BoundingBox,
  scale?: ImageScale
): ViewStyle | undefined => {
  // Initialize scaleFactor and offset variables
  let scaleFactor = { x: 1, y: 1 };
  let offset = { offsetX: 0, offsetY: 0 };

  // Determine the scaleFactor and offset based on the provided scale parameter
  if (!scale) {
    scaleFactor = { x: 1, y: 1 };
    offset = { offsetX: 0, offsetY: 0 };
  } else if (typeof scale === "number") {
    scaleFactor = { x: scale, y: scale };
    offset = { offsetX: 0, offsetY: 0 };
  } else {
    scaleFactor = { x: scale.x, y: scale.y };
    offset = { offsetX: scale.offsetX ?? 0, offsetY: scale.offsetY ?? 0 };
  }

  // Calculate the style object using useMemo to optimize performance
  return useMemo((): ViewStyle | undefined => {
    // Check if the box has valid size and origin properties
    if (!box?.size || !box?.origin) return undefined;

    // Calculate the style object based on the box properties, scaleFactor, and offset
    return {
      height: box.size.y * scaleFactor.y,
      width: box.size.x * scaleFactor.x,
      borderColor: box.color ?? "magenta",
      borderWidth: box.width ?? 1,
      position: "absolute",
      top: box.origin.y * scaleFactor.y + offset.offsetY - (box.width ?? 0),
      left: box.origin.x * scaleFactor.x + offset.offsetX - (box.width ?? 0),
    };
  }, [box, scaleFactor, offset]);
};

/**
 * Represents a bounding box with origin, size, color, label, and width properties.
 */
export interface BoundingBox {
  origin: { x: number; y: number };
  size: { x: number; y: number };
  color?: string;
  label?: string;
  width?: number;
}
