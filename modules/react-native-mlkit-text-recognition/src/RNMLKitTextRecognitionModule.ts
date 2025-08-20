import { requireNativeModule } from "expo";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TextBase {
  text: string;
  frame: Rect;
  recognizedLanguage: string;
}

interface TextElement extends TextBase {}

interface TextLine extends TextBase {
  elements: TextElement[];
}

interface TextBlock extends TextBase {
  lines: TextLine[];
}

interface Text {
  text: string;
  textBlocks: TextBlock[];
}

interface RNMLKitTextRecognitionModule {
  recognizeText: (imagePath: string) => Promise<Text>;
}

const textRecognitionModule = requireNativeModule<RNMLKitTextRecognitionModule>(
  "RNMLKitTextRecognition"
);

async function recognizeText(imagePath: string): Promise<Text> {
  return await textRecognitionModule.recognizeText(imagePath);
}

export { recognizeText };
