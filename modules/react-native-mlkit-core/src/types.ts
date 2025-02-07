export interface RNMLKitPoint {
  x: number;
  y: number;
}

export interface RNMLKitRect {
  origin: RNMLKitPoint;
  size: RNMLKitPoint;
}

export interface ModelInfo<T> {
  model: number;
  options?: T;
}

export interface AssetRecord<T> {
  [key: string]: ModelInfo<T>;
}
