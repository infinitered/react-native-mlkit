import { requireNativeModule } from "expo";

type RNMLKitTextRecognitionModule = {
  recognizeText: (imagePath: string) => Promise<string>;
};

const textRecognitionModule = requireNativeModule<RNMLKitTextRecognitionModule>(
  "RNMLKitTextRecognition"
);

async function recognizeText(imagePath: string): Promise<string> {
  return await textRecognitionModule.recognizeText(imagePath);
}

export { recognizeText };
