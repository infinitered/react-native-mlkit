import { useState, useEffect } from "react";
import { LayoutRectangle } from "react-native";

export type ContentFit = "cover" | "contain" | "fill" | "none" | "scale-down";

/**
 * Represents the scale of an image.
 */
export type ImageScale =
  | {
      x: number;
      y: number;
      offsetX?: number;
      offsetY?: number;
    }
  | number;

type ImageSize = { width?: number | null; height?: number | null };

/**
 * Calculates the image scale based on the provided parameters.
 *
 * @param contentFit - The content fit mode specifying how the image should fit within the container.
 * @param container - The container object containing the width and height
 *   of the container.
 * @param image - The image object containing the width
 *   and height of the image.
 * @returns - The calculated image scale.
 */
export function useImageScale(
  contentFit: ContentFit,
  container: Pick<LayoutRectangle, "width" | "height">,
  image?: ImageSize
): ImageScale {
  const [scale, setScale] = useState<ImageScale>(1);

  useEffect(() => {
    if (!image?.width || !image?.height) {
      setScale(1);
      return;
    }

    let newScale: ImageScale;

    const coverScale = Math.max(
      container.width / image.width,
      container.height / image.height
    );
    const containScale = Math.min(
      container.width / image.width,
      container.height / image.height
    );
    const scaleDownScale = Math.min(
      1,
      Math.min(container.width / image.width, container.height / image.height)
    );

    switch (contentFit) {
      case "cover":
        newScale = {
          x: coverScale,
          y: coverScale,
          offsetX: (container.width - image.width * coverScale) / 2,
          offsetY: (container.height - image.height * coverScale) / 2,
        };
        break;
      case "contain":
        newScale = {
          x: containScale,
          y: containScale,
          offsetX: (container.width - image.width * containScale) / 2,
          offsetY: (container.height - image.height * containScale) / 2,
        };
        break;
      case "fill":
        newScale = {
          x: container.width / image.width,
          y: container.height / image.height,
          offsetX: 0,
          offsetY: 0,
        };
        break;
      case "none":
        newScale = {
          x: 1,
          y: 1,
          offsetX: (container.width - image.width) / 2,
          offsetY: (container.height - image.height) / 2,
        };
        break;
      case "scale-down":
        newScale = {
          x: scaleDownScale,
          y: scaleDownScale,
          offsetX: (container.width - image.width * scaleDownScale) / 2,
          offsetY: (container.height - image.height * scaleDownScale) / 2,
        };
        break;
      default:
        newScale = 1;
    }

    setScale(newScale);
  }, [
    contentFit,
    container.width,
    container.height,
    image?.width,
    image?.height,
  ]);

  return scale;
}
