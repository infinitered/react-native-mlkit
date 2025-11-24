import { requireNativeModule } from "expo";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TextElement {
  text: string
  frame: Rect
  recognizedLanguages: string[]
}

interface TextLine {
  text: string
  frame: Rect
  recognizedLanguages: string[]
  elements: TextElement[];
}

interface Block {
  text: string
  frame: Rect
  recognizedLanguages: string[]
  lines: TextLine[];
}

interface Text {
  text: string;
  blocks: Block[];
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
