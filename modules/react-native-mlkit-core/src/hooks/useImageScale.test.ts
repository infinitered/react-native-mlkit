import { renderHook } from "@testing-library/react-hooks";
import { LayoutRectangle } from "react-native"; // Update the path accordingly

import { useImageScale, ContentFit, ImageScale } from ".";

describe("useImageScale hook", () => {
  it("returns a scale of 1 for undefined image dimensions", () => {
    const { result } = renderHook(() =>
      useImageScale("cover", { width: 100, height: 100 })
    );
    expect(result.current).toEqual(1);
  });

  const testCases: {
    contentFit: ContentFit;
    container: Pick<LayoutRectangle, "width" | "height">;
    image: Pick<LayoutRectangle, "width" | "height">;
    expectedScale: ImageScale;
  }[] = [
    {
      contentFit: "cover",
      container: { width: 100, height: 200 },
      image: { width: 200, height: 100 },
      expectedScale: {
        x: 2,
        y: 2,
        offsetX: -150,
        offsetY: 0,
      },
    },
    {
      contentFit: "cover",
      container: { width: 100, height: 100 },
      image: { width: 50, height: 50 },
      expectedScale: {
        x: 2,
        y: 2,
        offsetX: 0,
        offsetY: 0,
      },
    },
    {
      contentFit: "contain",
      container: { width: 100, height: 200 },
      image: { width: 100, height: 50 },
      expectedScale: {
        x: 1,
        y: 1,
        offsetX: 0,
        offsetY: 75,
      },
    },
    {
      contentFit: "fill",
      container: { width: 100, height: 100 },
      image: { width: 50, height: 50 },
      expectedScale: {
        x: 2,
        y: 2,
        offsetX: 0,
        offsetY: 0,
      },
    },
    {
      contentFit: "none",
      container: { width: 100, height: 100 },
      image: { width: 50, height: 50 },
      expectedScale: {
        x: 1,
        y: 1,
        offsetX: 25,
        offsetY: 25,
      },
    },
    {
      contentFit: "scale-down",
      container: { width: 100, height: 100 },
      image: { width: 200, height: 200 },
      expectedScale: {
        x: 0.5,
        y: 0.5,
        offsetX: 0,
        offsetY: 0,
      },
    },
  ];

  testCases.forEach(({ contentFit, container, image, expectedScale }) => {
    it(`calculates the correct scale for contentFit: ${contentFit}`, () => {
      const { result } = renderHook(() =>
        useImageScale(contentFit, container, image)
      );
      expect(result.current).toEqual(expectedScale);
    });
  });
});
