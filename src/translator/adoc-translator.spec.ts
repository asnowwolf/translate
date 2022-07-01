import { Examples } from '../dom/asciidoctor/utils/examples';
import { adocTranslate } from './adoc-translator';

describe('adoc-translator', () => {
  it('document', async () => {
    expect(await adocTranslate(Examples.documentAdoc)).toEqual(Examples.documentAdocCn);
    expect(await adocTranslate(Examples.documentAdocCn)).toEqual(Examples.documentAdocCn);
  });
  it('documentWithPreamble', async () => {
    expect(await adocTranslate(Examples.documentWithPreambleAdoc)).toEqual(Examples.documentWithPreambleAdocCn);
    expect(await adocTranslate(Examples.documentWithPreambleAdocCn)).toEqual(Examples.documentWithPreambleAdocCn);
  });
  it('paragraph', async () => {
    expect(await adocTranslate(Examples.paragraphAdoc)).toEqual(Examples.paragraphAdocCn);
    expect(await adocTranslate(Examples.paragraphAdocCn)).toEqual(Examples.paragraphAdocCn);
  });
  it('sectionSimple', async () => {
    expect(await adocTranslate(Examples.sectionSimpleAdoc)).toEqual(Examples.sectionSimpleAdocCn);
    expect(await adocTranslate(Examples.sectionSimpleAdocCn)).toEqual(Examples.sectionSimpleAdocCn);
  });
  it('floatingTitle', async () => {
    expect(await adocTranslate(Examples.floatingTitleAdoc)).toEqual(Examples.floatingTitleAdocCn);
    expect(await adocTranslate(Examples.floatingTitleAdocCn)).toEqual(Examples.floatingTitleAdocCn);
  });
  it('sectionWithTitleAndAttributes', async () => {
    expect(await adocTranslate(Examples.sectionWithTitleAndAttributesAdoc)).toEqual(Examples.sectionWithTitleAndAttributesAdocCn);
    expect(await adocTranslate(Examples.sectionWithTitleAndAttributesAdocCn)).toEqual(Examples.sectionWithTitleAndAttributesAdocCn);
  });
  it('indexTermBlockSimple', async () => {
    expect(await adocTranslate(Examples.indexTermBlockSimpleAdoc)).toEqual(Examples.indexTermBlockSimpleAdocCn);
    expect(await adocTranslate(Examples.indexTermBlockSimpleAdocCn)).toEqual(Examples.indexTermBlockSimpleAdocCn);
  });
  it('indexTermBlockComplex', async () => {
    expect(await adocTranslate(Examples.indexTermBlockComplexAdoc)).toEqual(Examples.indexTermBlockComplexAdocCn);
    expect(await adocTranslate(Examples.indexTermBlockComplexAdocCn)).toEqual(Examples.indexTermBlockComplexAdocCn);
  });
  it('indexTermInline', async () => {
    expect(await adocTranslate(Examples.indexTermInlineAdoc)).toEqual(Examples.indexTermInlineAdocCn);
    expect(await adocTranslate(Examples.indexTermInlineAdocCn)).toEqual(Examples.indexTermInlineAdocCn);
  });
  it('breakThematic1', async () => {
    expect(await adocTranslate(Examples.breakThematic1Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakThematic2', async () => {
    expect(await adocTranslate(Examples.breakThematic2Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakThematic3', async () => {
    expect(await adocTranslate(Examples.breakThematic3Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakThematic4', async () => {
    expect(await adocTranslate(Examples.breakThematic4Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakThematic5', async () => {
    expect(await adocTranslate(Examples.breakThematic5Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakPage', async () => {
    expect(await adocTranslate(Examples.breakPageAdoc)).toEqual(Examples.breakPageNormalized);
  });
  it('unorderedListSimple', async () => {
    expect(await adocTranslate(Examples.unorderedListSimpleAdoc)).toEqual(Examples.unorderedListSimpleAdocCn);
    expect(await adocTranslate(Examples.unorderedListSimpleAdocCn)).toEqual(Examples.unorderedListSimpleAdocCn);
  });
  it('unorderedListWithParagraphs', async () => {
    expect(await adocTranslate(Examples.unorderedListWithParagraphsAdoc)).toEqual(Examples.unorderedListWithParagraphsAdocCn);
    expect(await adocTranslate(Examples.unorderedListWithParagraphsAdocCn)).toEqual(Examples.unorderedListWithParagraphsAdocCn);
  });
  it('orderedList', async () => {
    expect(await adocTranslate(Examples.orderedListAdoc)).toEqual(Examples.orderedListAdocCn);
    expect(await adocTranslate(Examples.orderedListAdocCn)).toEqual(Examples.orderedListAdocCn);
  });
  it('mixedList', async () => {
    expect(await adocTranslate(Examples.mixedListAdoc)).toEqual(Examples.mixedListAdocCn);
    expect(await adocTranslate(Examples.mixedListAdocCn)).toEqual(Examples.mixedListAdocCn);
  });
  it('descriptionListSimple', async () => {
    expect(await adocTranslate(Examples.descriptionListSimpleAdoc)).toEqual(Examples.descriptionListSimpleAdocCn);
    expect(await adocTranslate(Examples.descriptionListSimpleAdocCn)).toEqual(Examples.descriptionListSimpleAdocCn);
  });
  it('descriptionListComplex', async () => {
    expect(await adocTranslate(Examples.descriptionListComplexAdoc)).toEqual(Examples.descriptionListComplexAdocCn);
    expect(await adocTranslate(Examples.descriptionListComplexAdocCn)).toEqual(Examples.descriptionListComplexAdocCn);
  });
  it('listContinuation', async () => {
    expect(await adocTranslate(Examples.listContinuationAdoc)).toEqual(Examples.listContinuationAdocCn);
    expect(await adocTranslate(Examples.listContinuationAdocCn)).toEqual(Examples.listContinuationAdocCn);
  });
  it('textFormatSimple', async () => {
    expect(await adocTranslate(Examples.textFormatSimpleAdoc)).toEqual(Examples.textFormatSimpleAdocCn);
    expect(await adocTranslate(Examples.textFormatSimpleAdocCn)).toEqual(Examples.textFormatSimpleAdocCn);
  });
  it('textFormatNested', async () => {
    expect(await adocTranslate(Examples.textFormatNestedAdoc)).toEqual(Examples.textFormatNestedAdocCn);
    expect(await adocTranslate(Examples.textFormatNestedAdocCn)).toEqual(Examples.textFormatNestedAdocCn);
  });
  it('textFormatLiteralMonospace', async () => {
    expect(await adocTranslate(Examples.textFormatLiteralMonospaceAdoc)).toEqual(Examples.textFormatLiteralMonospaceAdocCn);
    expect(await adocTranslate(Examples.textFormatLiteralMonospaceAdocCn)).toEqual(Examples.textFormatLiteralMonospaceAdocCn);
  });
  it('textFormatCustomSpan', async () => {
    expect(await adocTranslate(Examples.textFormatCustomSpanAdoc)).toEqual(Examples.textFormatCustomSpanAdocCn);
    expect(await adocTranslate(Examples.textFormatCustomSpanAdocCn)).toEqual(Examples.textFormatCustomSpanAdocCn);
  });
  it('autoLinks', async () => {
    expect(await adocTranslate(Examples.autoLinksAdoc)).toEqual(Examples.autoLinksAdocCn);
    expect(await adocTranslate(Examples.autoLinksAdocCn)).toEqual(Examples.autoLinksAdocCn);
  });
  it('enclosedLink', async () => {
    expect(await adocTranslate(Examples.enclosedLinkAdoc)).toEqual(Examples.enclosedLinkAdocCn);
    expect(await adocTranslate(Examples.enclosedLinkAdocCn)).toEqual(Examples.enclosedLinkAdocCn);
  });
  it('autoLinkEscaped', async () => {
    expect(await adocTranslate(Examples.autoLinkEscapedAdoc)).toEqual(Examples.autoLinkEscapedAdocCn);
    expect(await adocTranslate(Examples.autoLinkEscapedAdocCn)).toEqual(Examples.autoLinkEscapedAdocCn);
  });
  it('urlMacro', async () => {
    expect(await adocTranslate(Examples.urlMacroAdoc)).toEqual(Examples.urlMacroAdocCn);
    expect(await adocTranslate(Examples.urlMacroAdocCn)).toEqual(Examples.urlMacroAdocCn);
  });
  it('textInterpolation', async () => {
    expect(await adocTranslate(Examples.textInterpolationAdoc)).toEqual(Examples.textInterpolationAdocCn);
    expect(await adocTranslate(Examples.textInterpolationAdocCn)).toEqual(Examples.textInterpolationAdocCn);
  });
  it('crossReferenceBasic', async () => {
    expect(await adocTranslate(Examples.crossReferenceBasicAdoc)).toEqual(Examples.crossReferenceBasicAdocCn);
    expect(await adocTranslate(Examples.crossReferenceBasicAdocCn)).toEqual(Examples.crossReferenceBasicAdocCn);
  });
  it('crossReferenceWithTitle', async () => {
    expect(await adocTranslate(Examples.crossReferenceWithTitleAdoc)).toEqual(Examples.crossReferenceWithTitleAdocCn);
    expect(await adocTranslate(Examples.crossReferenceWithTitleAdocCn)).toEqual(Examples.crossReferenceWithTitleAdocCn);
  });
  it('crossReferenceNature', async () => {
    expect(await adocTranslate(Examples.crossReferenceNatureAdoc)).toEqual(Examples.crossReferenceNatureAdocCn);
    expect(await adocTranslate(Examples.crossReferenceNatureAdocCn)).toEqual(Examples.crossReferenceNatureAdocCn);
  });
  it('crossReferenceToOtherDocument', async () => {
    expect(await adocTranslate(Examples.crossReferenceToOtherDocumentAdoc)).toEqual(Examples.crossReferenceToOtherDocumentAdocCn);
    expect(await adocTranslate(Examples.crossReferenceToOtherDocumentAdocCn)).toEqual(Examples.crossReferenceToOtherDocumentAdocCn);
  });
  it('footnotes', async () => {
    expect(await adocTranslate(Examples.footnotesAdoc)).toEqual(Examples.footnotesAdocCn);
    expect(await adocTranslate(Examples.footnotesAdocCn)).toEqual(Examples.footnotesAdocCn);
  });
  it('imageBlock', async () => {
    expect(await adocTranslate(Examples.imageBlockAdoc)).toEqual(Examples.imageBlockAdocCn);
    expect(await adocTranslate(Examples.imageBlockAdocCn)).toEqual(Examples.imageBlockAdocCn);
  });
  it('imageInline', async () => {
    expect(await adocTranslate(Examples.imageInlineAdoc)).toEqual(Examples.imageInlineAdocCn);
    expect(await adocTranslate(Examples.imageInlineAdocCn)).toEqual(Examples.imageInlineAdocCn);
  });
  it('imageBlockWithTitleAndAttributes', async () => {
    expect(await adocTranslate(Examples.imageBlockWithTitleAndAttributesAdoc)).toEqual(Examples.imageBlockWithTitleAndAttributesAdocCn);
    expect(await adocTranslate(Examples.imageBlockWithTitleAndAttributesAdocCn)).toEqual(Examples.imageBlockWithTitleAndAttributesAdocCn);
  });
  it('imageWithPositionalAttributes', async () => {
    expect(await adocTranslate(Examples.imageWithPositionalAttributesAdoc)).toEqual(Examples.imageWithPositionalAttributesAdocCn);
    expect(await adocTranslate(Examples.imageWithPositionalAttributesAdocCn)).toEqual(Examples.imageWithPositionalAttributesAdocCn);
  });
  it('video', async () => {
    expect(await adocTranslate(Examples.videoAdoc)).toEqual(Examples.videoAdocCn);
    expect(await adocTranslate(Examples.videoAdocCn)).toEqual(Examples.videoAdocCn);
  });
  it('icon', async () => {
    expect(await adocTranslate(Examples.iconAdoc)).toEqual(Examples.iconAdocCn);
    expect(await adocTranslate(Examples.iconAdocCn)).toEqual(Examples.iconAdocCn);
  });
  it('keyboardMacro', async () => {
    expect(await adocTranslate(Examples.keyboardMacroAdoc)).toEqual(Examples.keyboardMacroAdocCn);
    expect(await adocTranslate(Examples.keyboardMacroAdocCn)).toEqual(Examples.keyboardMacroAdocCn);
  });
  it('buttonMacro', async () => {
    expect(await adocTranslate(Examples.buttonMacroAdoc)).toEqual(Examples.buttonMacroAdocCn);
    expect(await adocTranslate(Examples.buttonMacroAdocCn)).toEqual(Examples.buttonMacroAdocCn);
  });
  it('menuMacro', async () => {
    expect(await adocTranslate(Examples.menuMacroAdoc)).toEqual(Examples.menuMacroAdocCn);
    expect(await adocTranslate(Examples.menuMacroAdocCn)).toEqual(Examples.menuMacroAdocCn);
  });
  it('admonitionSimple', async () => {
    expect(await adocTranslate(Examples.admonitionSimpleAdoc)).toEqual(Examples.admonitionSimpleAdocCn);
    expect(await adocTranslate(Examples.admonitionSimpleAdocCn)).toEqual(Examples.admonitionSimpleAdocCn);
  });
  it('admonitionComplex', async () => {
    expect(await adocTranslate(Examples.admonitionComplexAdoc)).toEqual(Examples.admonitionComplexAdocCn);
    expect(await adocTranslate(Examples.admonitionComplexAdocCn)).toEqual(Examples.admonitionComplexAdocCn);
  });
  it('sidebarSimple', async () => {
    expect(await adocTranslate(Examples.sidebarSimpleAdoc)).toEqual(Examples.sidebarSimpleAdocCn);
    expect(await adocTranslate(Examples.sidebarSimpleAdocCn)).toEqual(Examples.sidebarSimpleAdocCn);
  });
  it('sidebarComplex', async () => {
    expect(await adocTranslate(Examples.sidebarComplexAdoc)).toEqual(Examples.sidebarComplexAdocCn);
    expect(await adocTranslate(Examples.sidebarComplexAdocCn)).toEqual(Examples.sidebarComplexAdocCn);
  });
  it('exampleBlockSimple', async () => {
    expect(await adocTranslate(Examples.exampleBlockSimpleAdoc)).toEqual(Examples.exampleBlockSimpleAdocCn);
    expect(await adocTranslate(Examples.exampleBlockSimpleAdocCn)).toEqual(Examples.exampleBlockSimpleAdocCn);
  });
  it('exampleBlockComplex', async () => {
    expect(await adocTranslate(Examples.exampleBlockComplexAdoc)).toEqual(Examples.exampleBlockComplexAdocCn);
    expect(await adocTranslate(Examples.exampleBlockComplexAdocCn)).toEqual(Examples.exampleBlockComplexAdocCn);
  });
  it('blockQuoteSimple', async () => {
    expect(await adocTranslate(Examples.blockQuoteSimpleAdoc)).toEqual(Examples.blockQuoteSimpleAdocCn);
    expect(await adocTranslate(Examples.blockQuoteSimpleAdocCn)).toEqual(Examples.blockQuoteSimpleAdocCn);
  });
  it('blockQuoteHighlight', async () => {
    expect(await adocTranslate(Examples.blockQuoteHighlightAdoc)).toEqual(Examples.blockQuoteHighlightAdocCn);
    expect(await adocTranslate(Examples.blockQuoteHighlightAdocCn)).toEqual(Examples.blockQuoteHighlightAdocCn);
  });
  it('blockQuoteShorthand', async () => {
    expect(await adocTranslate(Examples.blockQuoteShorthandAdoc)).toEqual(Examples.blockQuoteShorthandAdocCn);
    expect(await adocTranslate(Examples.blockQuoteShorthandAdocCn)).toEqual(Examples.blockQuoteShorthandAdocCn);
  });
  it('blockQuoteMarkdown', async () => {
    expect(await adocTranslate(Examples.blockQuoteMarkdownAdoc)).toEqual(Examples.blockQuoteMarkdownAdocCn);
  });
  it('verse', async () => {
    expect(await adocTranslate(Examples.verseAdoc)).toEqual(Examples.verseAdocCn);
    expect(await adocTranslate(Examples.verseAdocCn)).toEqual(Examples.verseAdocCn);
  });
  it('sourceCodeSimple', async () => {
    expect(await adocTranslate(Examples.sourceCodeSimpleAdoc)).toEqual(Examples.sourceCodeSimpleAdocCn);
    expect(await adocTranslate(Examples.sourceCodeSimpleAdocCn)).toEqual(Examples.sourceCodeSimpleAdocCn);
  });
  it('sourceCodeNoIndent', async () => {
    expect(await adocTranslate(Examples.sourceCodeNoIndentAdoc)).toEqual(Examples.sourceCodeNoIndentAdocCn);
    expect(await adocTranslate(Examples.sourceCodeNoIndentAdocCn)).toEqual(Examples.sourceCodeNoIndentAdocCn);
  });
  it('sourceCodeHighlight', async () => {
    expect(await adocTranslate(Examples.sourceCodeHighlightAdoc)).toEqual(Examples.sourceCodeHighlightAdocCn);
    expect(await adocTranslate(Examples.sourceCodeHighlightAdocCn)).toEqual(Examples.sourceCodeHighlightAdocCn);
  });
  it('sourceCodeHighlightLines', async () => {
    expect(await adocTranslate(Examples.sourceCodeHighlightLinesAdoc)).toEqual(Examples.sourceCodeHighlightLinesAdocCn);
    expect(await adocTranslate(Examples.sourceCodeHighlightLinesAdocCn)).toEqual(Examples.sourceCodeHighlightLinesAdocCn);
  });
  it('listingBlock', async () => {
    expect(await adocTranslate(Examples.listingBlockAdoc)).toEqual(Examples.listingBlockAdocCn);
    expect(await adocTranslate(Examples.listingBlockAdocCn)).toEqual(Examples.listingBlockAdocCn);
  });
  it('literalBlockWithStyle', async () => {
    expect(await adocTranslate(Examples.literalBlockWithStyleAdoc)).toEqual(Examples.literalBlockWithStyleAdocCn);
    expect(await adocTranslate(Examples.literalBlockWithStyleAdocCn)).toEqual(Examples.literalBlockWithStyleAdocCn);
  });
  it('literalBlockWithDelimiter', async () => {
    expect(await adocTranslate(Examples.literalBlockWithDelimiterAdoc)).toEqual(Examples.literalBlockWithDelimiterAdocCn);
    expect(await adocTranslate(Examples.literalBlockWithDelimiterAdocCn)).toEqual(Examples.literalBlockWithDelimiterAdocCn);
  });
  it('sourceCodeCallouts', async () => {
    expect(await adocTranslate(Examples.sourceCodeCalloutsAdoc)).toEqual(Examples.sourceCodeCalloutsAdocCn);
    expect(await adocTranslate(Examples.sourceCodeCalloutsAdocCn)).toEqual(Examples.sourceCodeCalloutsAdocCn);
  });
  it('sourceCodeWithIndent', async () => {
    expect(await adocTranslate(Examples.sourceCodeWithIndentAdoc)).toEqual(Examples.sourceCodeWithIndentAdocCn);
    expect(await adocTranslate(Examples.sourceCodeWithIndentAdocCn)).toEqual(Examples.sourceCodeWithIndentAdocCn);
  });
  it('tableEmpty', async () => {
    expect(await adocTranslate(Examples.tableEmptyAdoc)).toEqual(Examples.tableEmptyAdocCn);
    expect(await adocTranslate(Examples.tableEmptyAdocCn)).toEqual(Examples.tableEmptyAdocCn);
  });
  it('tableWithTitle', async () => {
    expect(await adocTranslate(Examples.tableWithTitleAdoc)).toEqual(Examples.tableWithTitleAdocCn);
    expect(await adocTranslate(Examples.tableWithTitleAdocCn)).toEqual(Examples.tableWithTitleAdocCn);
  });
  it('tableWithoutHeader', async () => {
    expect(await adocTranslate(Examples.tableWithoutHeaderAdoc)).toEqual(Examples.tableWithoutHeaderAdocCn);
    expect(await adocTranslate(Examples.tableWithoutHeaderAdocCn)).toEqual(Examples.tableWithoutHeaderAdocCn);
  });
  it('tableWithHeader', async () => {
    expect(await adocTranslate(Examples.tableWithHeaderAdoc)).toEqual(Examples.tableWithHeaderAdocCn);
    expect(await adocTranslate(Examples.tableWithHeaderAdocCn)).toEqual(Examples.tableWithHeaderAdocCn);
  });
  it('tableAlignment', async () => {
    expect(await adocTranslate(Examples.tableAlignmentAdoc)).toEqual(Examples.tableAlignmentAdocCn);
    expect(await adocTranslate(Examples.tableAlignmentAdocCn)).toEqual(Examples.tableAlignmentAdocCn);
  });
  it('tableFormatCellContent', async () => {
    expect(await adocTranslate(Examples.tableFormatCellContentAdoc)).toEqual(Examples.tableFormatCellContentAdocCn);
    expect(await adocTranslate(Examples.tableFormatCellContentAdocCn)).toEqual(Examples.tableFormatCellContentAdocCn);
  });
  it('tableOverrideStyle', async () => {
    expect(await adocTranslate(Examples.tableOverrideStyleAdoc)).toEqual(Examples.tableOverrideStyleAdocCn);
    expect(await adocTranslate(Examples.tableOverrideStyleAdocCn)).toEqual(Examples.tableOverrideStyleAdocCn);
  });
  xit('tableAdocBlockInCell', async () => {
    // TODO: 处理表格中的嵌套 AsciiDoc
    // TODO: 还原 source 的格式
    expect(await adocTranslate(Examples.tableAdocBlockInCellAdoc)).toEqual(Examples.tableAdocBlockInCellAdocCn);
    expect(await adocTranslate(Examples.tableAdocBlockInCellAdocCn)).toEqual(Examples.tableAdocBlockInCellAdocCn);
  });
  it('tableColSpanAndRowSpan', async () => {
    expect(await adocTranslate(Examples.tableColSpanAndRowSpanAdoc)).toEqual(Examples.tableColSpanAndRowSpanAdocCn);
    expect(await adocTranslate(Examples.tableColSpanAndRowSpanAdocCn)).toEqual(Examples.tableColSpanAndRowSpanAdocCn);
  });
  it('tableWidth', async () => {
    expect(await adocTranslate(Examples.tableWidthAdoc)).toEqual(Examples.tableWidthAdocCn);
    expect(await adocTranslate(Examples.tableWidthAdocCn)).toEqual(Examples.tableWidthAdocCn);
  });
  it('tableCustomSeparator', async () => {
    expect(await adocTranslate(Examples.tableCustomSeparatorAdoc)).toEqual(Examples.tableCustomSeparatorAdocCn);
    expect(await adocTranslate(Examples.tableCustomSeparatorAdocCn)).toEqual(Examples.tableCustomSeparatorAdocCn);
  });
  it('tableCsv', async () => {
    expect(await adocTranslate(Examples.tableCsvAdoc)).toEqual(Examples.tableCsvAdocCn);
  });
  it('tableEscapePipeChar', async () => {
    expect(await adocTranslate(Examples.tableEscapePipeCharAdoc)).toEqual(Examples.tableEscapePipeCharAdocCn);
    expect(await adocTranslate(Examples.tableEscapePipeCharAdocCn)).toEqual(Examples.tableEscapePipeCharAdocCn);
  });
  it('stemInline', async () => {
    expect(await adocTranslate(Examples.stemInlineAdoc)).toEqual(Examples.stemInlineAdocCn);
    expect(await adocTranslate(Examples.stemInlineAdocCn)).toEqual(Examples.stemInlineAdocCn);
  });
  it('stemBlock', async () => {
    expect(await adocTranslate(Examples.stemBlockAdoc)).toEqual(Examples.stemBlockAdocCn);
    expect(await adocTranslate(Examples.stemBlockAdocCn)).toEqual(Examples.stemBlockAdocCn);
  });
  it('stemMixed', async () => {
    expect(await adocTranslate(Examples.stemMixedAdoc)).toEqual(Examples.stemMixedAdocCn);
    expect(await adocTranslate(Examples.stemMixedAdocCn)).toEqual(Examples.stemMixedAdocCn);
  });
  it('openBlockSimple', async () => {
    expect(await adocTranslate(Examples.openBlockSimpleAdoc)).toEqual(Examples.openBlockSimpleAdocCn);
    expect(await adocTranslate(Examples.openBlockSimpleAdocCn)).toEqual(Examples.openBlockSimpleAdocCn);
  });
  it('openBlockComplex', async () => {
    expect(await adocTranslate(Examples.openBlockComplexAdoc)).toEqual(Examples.openBlockComplexAdocCn);
    expect(await adocTranslate(Examples.openBlockComplexAdocCn)).toEqual(Examples.openBlockComplexAdocCn);
  });
  it('includeSimple', async () => {
    expect(await adocTranslate(Examples.includeSimpleAdoc)).toEqual(Examples.includeSimpleAdocCn);
    expect(await adocTranslate(Examples.includeSimpleAdocCn)).toEqual(Examples.includeSimpleAdocCn);
  });
  it('includeWithAttributes', async () => {
    expect(await adocTranslate(Examples.includeWithAttributesAdoc)).toEqual(Examples.includeWithAttributesAdocCn);
    expect(await adocTranslate(Examples.includeWithAttributesAdocCn)).toEqual(Examples.includeWithAttributesAdocCn);
  });
  it('includeUnresolvedDirective', async () => {
    expect(await adocTranslate(Examples.includeUnresolvedDirectiveAdoc)).toEqual(Examples.includeUnresolvedDirectiveAdocCn);
    expect(await adocTranslate(Examples.includeUnresolvedDirectiveAdocCn)).toEqual(Examples.includeUnresolvedDirectiveAdocCn);
  });
  it('escapeSimple', async () => {
    expect(await adocTranslate(Examples.escapeSimpleAdoc)).toEqual(Examples.escapeSimpleAdocCn);
    expect(await adocTranslate(Examples.escapeSimpleAdocCn)).toEqual(Examples.escapeSimpleAdocCn);
  });
  it('escapePlus', async () => {
    expect(await adocTranslate(Examples.escapePlusAdoc)).toEqual(Examples.escapePlusAdocCn);
    expect(await adocTranslate(Examples.escapePlusAdocCn)).toEqual(Examples.escapePlusAdocCn);
  });
  it('escapeStarStar', async () => {
    expect(await adocTranslate(Examples.escapeStarStarAdoc)).toEqual(Examples.escapeStarStarAdocCn);
    expect(await adocTranslate(Examples.escapeStarStarAdocCn)).toEqual(Examples.escapeStarStarAdocCn);
  });
  it('escapeDollarBrace', async () => {
    expect(await adocTranslate(Examples.escapeDollarBraceAdoc)).toEqual(Examples.escapeDollarBraceAdocCn);
    expect(await adocTranslate(Examples.escapeDollarBraceAdocCn)).toEqual(Examples.escapeDollarBraceAdocCn);
  });
  it('conditionalDirective', async () => {
    expect(await adocTranslate(Examples.conditionalDirectiveAdoc)).toEqual(Examples.conditionalDirectiveAdocCn);
    expect(await adocTranslate(Examples.conditionalDirectiveAdocCn)).toEqual(Examples.conditionalDirectiveAdocCn);
  });
});
