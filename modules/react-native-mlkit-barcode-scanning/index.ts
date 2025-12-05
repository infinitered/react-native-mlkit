// Reexport the native module. On web, it will be resolved to ReactNativeMlkitBarcodeScanningModule.web.ts
// and on native platforms to ReactNativeMlkitBarcodeScanningModule.ts
export { default } from './src/ReactNativeMlkitBarcodeScanningModule';
export { default as ReactNativeMlkitBarcodeScanningView } from './src/ReactNativeMlkitBarcodeScanningView';
export * from  './src/ReactNativeMlkitBarcodeScanning.types';
