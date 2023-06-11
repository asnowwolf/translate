export type TranslationPair = [original: string, translation: string];

export function buildTranslationPair(originalText: string | undefined, translationText: string): TranslationPair {
  if (originalText) {
    return [originalText, translationText];
  } else {
    return [translationText, ''];
  }
}
