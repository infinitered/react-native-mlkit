// Reexport the native module. On web, it will be resolved to RNMLKitTextRecognitionModule.web.ts
// and on native platforms to RNMLKitTextRecognitionModule.ts
export { recognizeText } from './src/RNMLKitTextRecognitionModule';

