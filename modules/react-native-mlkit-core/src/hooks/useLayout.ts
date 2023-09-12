import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

type LayoutChangeEventHandler = (event: LayoutChangeEvent) => void;

export function useLayout() {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    setLayout(layout);
  };

  return [layout, onLayout] as [LayoutRectangle, LayoutChangeEventHandler];
}
