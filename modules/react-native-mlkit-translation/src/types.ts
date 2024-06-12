export interface RNMLKitTranslationLanguage {
  code: string;
}

export interface RNMLKitTranslation {
  listLanguages(): RNMLKitTranslationLanguage[];
  listModelsAsync: () => Promise<string[]>;
}
