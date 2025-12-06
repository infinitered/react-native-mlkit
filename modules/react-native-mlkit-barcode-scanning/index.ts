// Reexport the native module. On web, it will be resolved to RNMLKitBarcodeScanningModule.web.ts
// and on native platforms to RNMLKitBarcodeScanningModule.ts
export { default } from './src/RNMLKitBarcodeScanningModule';
export * from  './src/RNMLKitBarcodeScanning.types';
