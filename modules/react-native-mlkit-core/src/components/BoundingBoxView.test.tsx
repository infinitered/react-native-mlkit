import { render } from "@testing-library/react-native";
import React from "react";

import { BoundingBoxView } from "./BoundingBoxView";
import { useBoundingBoxStyle, BoundingBox } from "../hooks";

// Mocking the hooks
jest.mock("../hooks", () => ({
  useBoundingBoxStyle: jest.fn(),
}));

const mockBox: BoundingBox = {
  origin: { x: 10, y: 10 },
  size: { x: 100, y: 50 },
};

describe("BoundingBoxView component", () => {
  it("renders correctly without a label", () => {
    (useBoundingBoxStyle as jest.Mock).mockReturnValue({
      height: 50,
      width: 100,
      borderColor: "magenta",
      borderWidth: 1,
      position: "absolute",
      top: 10,
      left: 10,
    });

    const { queryByTestId } = render(
      <BoundingBoxView
        box={mockBox}
        scale={{ x: 1, y: 1, offsetX: 0, offsetY: 0 }}
        testId="test"
      />
    );

    expect(queryByTestId(`test--boundingBox--x10y10-w100h50`)).toBeTruthy();
    expect(queryByTestId(`test-text`)).toBeNull();
  });

  it("renders correctly with a label", () => {
    const labelBox = { ...mockBox, label: "TestLabel" };

    (useBoundingBoxStyle as jest.Mock).mockReturnValue({
      height: 50,
      width: 100,
      borderColor: "magenta",
      borderWidth: 1,
      position: "absolute",
      top: 10,
      left: 10,
    });

    const { getByTestId } = render(
      <BoundingBoxView
        box={labelBox}
        scale={{ x: 1, y: 1, offsetX: 0, offsetY: 0 }}
        testId="test"
      />
    );

    expect(getByTestId(`test-text`).props.children).toBe("TestLabel");
  });

  it("renders with different scales", () => {
    const labelBox = { ...mockBox, label: "TestLabel" };

    (useBoundingBoxStyle as jest.Mock).mockReturnValue({
      height: 50 * 2,
      width: 100 * 2,
      borderColor: "magenta",
      borderWidth: 1,
      position: "absolute",
      top: 10 * 2,
      left: 10 * 2,
    });

    const { getByTestId } = render(
      <BoundingBoxView
        box={labelBox}
        scale={{ x: 2, y: 2, offsetX: 0, offsetY: 0 }}
        testId="test"
      />
    );

    const boundingBox = getByTestId(`test--boundingBox--x10y10-w100h50`);
    expect(boundingBox.props.style.height).toBe(100);
    expect(boundingBox.props.style.width).toBe(200);
  });

  it("verifies style calculations", () => {
    (useBoundingBoxStyle as jest.Mock).mockReturnValue({
      height: 50,
      width: 100,
      borderColor: "blue",
      borderWidth: 2,
      position: "absolute",
      top: 20,
      left: 20,
    });

    const { getByTestId } = render(
      <BoundingBoxView
        box={mockBox}
        scale={{ x: 1, y: 1, offsetX: 0, offsetY: 0 }}
        testId="test"
      />
    );

    const boundingBox = getByTestId(`test--boundingBox--x10y10-w100h50`);
    expect(boundingBox.props.style.borderColor).toBe("blue");
    expect(boundingBox.props.style.borderWidth).toBe(2);
    expect(boundingBox.props.style.top).toBe(20);
    expect(boundingBox.props.style.left).toBe(20);
  });
});
