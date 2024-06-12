import RNMLKitObjectDetectionModule from "./RNMLKitTranslationModule";
import { RNMLKitTranslationLanguage } from "./types";

export * from "./types";

export function listModelsAsync(): string[] {
  return RNMLKitObjectDetectionModule.listModelsAsync();
}

export function listLanguages(): RNMLKitTranslationLanguage[] {
  return RNMLKitObjectDetectionModule.listLanguages();
}
