import { render } from "@testing-library/react-native";
import React from "react";

import { ImageWithBoundingBoxes } from "./ImageWithBoundingBoxes";

// Mocking the hooks
jest.mock("../hooks", () => ({
  ...jest.requireActual("../hooks"),
  useLayout: jest.fn(() => [{}, jest.fn()]), // Returns initial layout and a mock function
  useImageScale: jest.fn(() => 1), // Returns a scale factor of 1
}));

jest.mock("expo-image", () => {
  return {
    Image: "MockedImage",
    ImageStyle: jest.fn(),
    ImageSource: jest.fn(),
  };
});

describe("ImageWithBoundingBoxes component", () => {
  it("renders without crashing", () => {
    render(<ImageWithBoundingBoxes />);
  });

  it("renders an image with localUri", () => {
    const testId = "test";
    const localUri = "local://path/to/image.jpg";
    const { getByTestId } = render(
      <ImageWithBoundingBoxes image={{ localUri }} testId={testId} />
    );
    expect(getByTestId(`${testId}-image`).props.source.uri).toBe(localUri);
  });

  it("renders an image with uri when localUri is not provided", () => {
    const testId = "test";
    const uri = "http://path/to/image.jpg";
    const { getByTestId } = render(
      <ImageWithBoundingBoxes image={{ uri }} testId={testId} />
    );
    expect(getByTestId(`${testId}-image`).props.source.uri).toBe(uri);
  });

  it("doesn't render an image when no URI is provided", () => {
    const { queryByTestId } = render(<ImageWithBoundingBoxes />);
    expect(queryByTestId("test-image")).toBeNull();
  });

  it("renders bounding boxes correctly", () => {
    const boundingBoxes = [
      {
        origin: { x: 10, y: 10 },
        size: { x: 100, y: 50 },
      },
    ];
    const { getByTestId } = render(
      <ImageWithBoundingBoxes boundingBoxes={boundingBoxes} testId="test" />
    );
    expect(
      getByTestId("test-boundingBoxView--boundingBox--x10y10-w100h50")
    ).toBeTruthy();
  });

  it("doesn't render bounding boxes when not provided", () => {
    const { queryByTestId } = render(<ImageWithBoundingBoxes />);
    const boundingBoxView = queryByTestId(/test-boundingBoxView--boundingBox/);
    expect(boundingBoxView).toBeNull();
  });

  it("applies style to the outer view", () => {
    const style = { backgroundColor: "red" };
    const { getByTestId } = render(
      <ImageWithBoundingBoxes style={style} testId="test" />
    );
    const styleProp = getByTestId("test").props.style;
    expect(styleProp[styleProp.length - 1]).toMatchObject(style);
  });

  it("applies imageStyle to the image", () => {
    const imageStyle = { borderRadius: 10 };
    const { getByTestId } = render(
      <ImageWithBoundingBoxes imageStyle={imageStyle} testId="test" />
    );
    expect(getByTestId("test-image").props.style).toContainEqual(imageStyle);
  });

  it("adjusts image size based on contentFit prop", () => {
    const { getByTestId, rerender } = render(
      <ImageWithBoundingBoxes contentFit="fill" testId="test" />
    );
    const image = getByTestId("test-image");
    rerender(<ImageWithBoundingBoxes contentFit="none" testId="test" />);
    expect(image.props.contentFit).toBe("none");
  });
});
