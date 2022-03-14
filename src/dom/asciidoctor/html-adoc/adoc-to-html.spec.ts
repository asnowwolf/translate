import { Examples } from '../utils/examples';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { adocToTinyHtml } from './adoc-to-tiny-html';

function adocToDefaultHtml(content: string): string {
  const result = createAsciidoctor().convert(content, { backend: 'html5', standalone: /^= /.test(content) }) as string;
  return result.replace(/(?<=\n)Last updated \d+-\d+-\d+ \d+:\d+:\d+ \+\d+/g, 'Last updated 2000-01-01 00:00:00 +0000');
}

function toTinyHtml(content: string): string {
  return adocToTinyHtml(content).replace(/\b\d\d:\d\d:\d\d\b/g, '00:00:00');
}

describe('adoc-to-html', () => {
  it('document', () => {
    expect(adocToDefaultHtml(Examples.documentAdoc)).toEqual(Examples.documentHtml);
    expect(toTinyHtml(Examples.documentAdoc)).toEqual(Examples.documentTiny);
  });
  it('documentWithPreamble', () => {
    expect(adocToDefaultHtml(Examples.documentWithPreambleAdoc)).toEqual(Examples.documentWithPreambleHtml);
    expect(toTinyHtml(Examples.documentWithPreambleAdoc)).toEqual(Examples.documentWithPreambleTiny);
  });
  it('paragraph', () => {
    expect(adocToDefaultHtml(Examples.paragraphAdoc)).toEqual(Examples.paragraphHtml);
    expect(toTinyHtml(Examples.paragraphAdoc)).toEqual(Examples.paragraphTiny);
  });
  it('sectionSimple', () => {
    expect(adocToDefaultHtml(Examples.sectionSimpleAdoc)).toEqual(Examples.sectionSimpleHtml);
    expect(toTinyHtml(Examples.sectionSimpleAdoc)).toEqual(Examples.sectionSimpleTiny);
  });
  it('floatingTitle', () => {
    expect(adocToDefaultHtml(Examples.floatingTitleAdoc)).toEqual(Examples.floatingTitleHtml);
    expect(toTinyHtml(Examples.floatingTitleAdoc)).toEqual(Examples.floatingTitleTiny);
  });
  it('sectionWithTitleAndAttributes', () => {
    expect(adocToDefaultHtml(Examples.sectionWithTitleAndAttributesAdoc)).toEqual(Examples.sectionWithTitleAndAttributesHtml);
    expect(toTinyHtml(Examples.sectionWithTitleAndAttributesAdoc)).toEqual(Examples.sectionWithTitleAndAttributesTiny);
  });
  it('indexTermBlockSimple', () => {
    expect(adocToDefaultHtml(Examples.indexTermBlockSimpleAdoc)).toEqual(Examples.indexTermBlockSimpleHtml);
    expect(toTinyHtml(Examples.indexTermBlockSimpleAdoc)).toEqual(Examples.indexTermBlockSimpleTiny);
  });
  it('indexTermBlockComplex', () => {
    expect(adocToDefaultHtml(Examples.indexTermBlockComplexAdoc)).toEqual(Examples.indexTermBlockComplexHtml);
    expect(toTinyHtml(Examples.indexTermBlockComplexAdoc)).toEqual(Examples.indexTermBlockComplexTiny);
  });
  it('indexTermInline', () => {
    expect(adocToDefaultHtml(Examples.indexTermInlineAdoc)).toEqual(Examples.indexTermInlineHtml);
    expect(toTinyHtml(Examples.indexTermInlineAdoc)).toEqual(Examples.indexTermInlineTiny);
  });
  it('breakThematic1', () => {
    expect(adocToDefaultHtml(Examples.breakThematic1Adoc)).toEqual(Examples.breakThematic1Html);
    expect(toTinyHtml(Examples.breakThematic1Adoc)).toEqual(Examples.breakThematic1Tiny);
  });
  it('breakThematic2', () => {
    expect(adocToDefaultHtml(Examples.breakThematic2Adoc)).toEqual(Examples.breakThematic2Html);
    expect(toTinyHtml(Examples.breakThematic2Adoc)).toEqual(Examples.breakThematic2Tiny);
  });
  it('breakThematic3', () => {
    expect(adocToDefaultHtml(Examples.breakThematic3Adoc)).toEqual(Examples.breakThematic3Html);
    expect(toTinyHtml(Examples.breakThematic3Adoc)).toEqual(Examples.breakThematic3Tiny);
  });
  it('breakThematic4', () => {
    expect(adocToDefaultHtml(Examples.breakThematic4Adoc)).toEqual(Examples.breakThematic4Html);
    expect(toTinyHtml(Examples.breakThematic4Adoc)).toEqual(Examples.breakThematic4Tiny);
  });
  it('breakThematic5', () => {
    expect(adocToDefaultHtml(Examples.breakThematic5Adoc)).toEqual(Examples.breakThematic5Html);
    expect(toTinyHtml(Examples.breakThematic5Adoc)).toEqual(Examples.breakThematic5Tiny);
  });
  it('breakPage', () => {
    expect(adocToDefaultHtml(Examples.breakPageAdoc)).toEqual(Examples.breakPageHtml);
    expect(toTinyHtml(Examples.breakPageAdoc)).toEqual(Examples.breakPageTiny);
  });
  it('unorderedListSimple', () => {
    expect(adocToDefaultHtml(Examples.unorderedListSimpleAdoc)).toEqual(Examples.unorderedListSimpleHtml);
    expect(toTinyHtml(Examples.unorderedListSimpleAdoc)).toEqual(Examples.unorderedListSimpleTiny);
  });
  it('unorderedListWithParagraphs', () => {
    expect(adocToDefaultHtml(Examples.unorderedListWithParagraphsAdoc)).toEqual(Examples.unorderedListWithParagraphsHtml);
    expect(toTinyHtml(Examples.unorderedListWithParagraphsAdoc)).toEqual(Examples.unorderedListWithParagraphsTiny);
  });
  it('orderedList', () => {
    expect(adocToDefaultHtml(Examples.orderedListAdoc)).toEqual(Examples.orderedListHtml);
    expect(toTinyHtml(Examples.orderedListAdoc)).toEqual(Examples.orderedListTiny);
  });
  it('mixedList', () => {
    expect(adocToDefaultHtml(Examples.mixedListAdoc)).toEqual(Examples.mixedListHtml);
    expect(toTinyHtml(Examples.mixedListAdoc)).toEqual(Examples.mixedListTiny);
  });
  it('descriptionListSimple', () => {
    expect(adocToDefaultHtml(Examples.descriptionListSimpleAdoc)).toEqual(Examples.descriptionListSimpleHtml);
    expect(toTinyHtml(Examples.descriptionListSimpleAdoc)).toEqual(Examples.descriptionListSimpleTiny);
  });
  it('descriptionListComplex', () => {
    expect(adocToDefaultHtml(Examples.descriptionListComplexAdoc)).toEqual(Examples.descriptionListComplexHtml);
    expect(toTinyHtml(Examples.descriptionListComplexAdoc)).toEqual(Examples.descriptionListComplexTiny);
  });
  it('textFormatSimple', () => {
    expect(adocToDefaultHtml(Examples.textFormatSimpleAdoc)).toEqual(Examples.textFormatSimpleHtml);
    expect(toTinyHtml(Examples.textFormatSimpleAdoc)).toEqual(Examples.textFormatSimpleTiny);
  });
  it('textFormatNested', () => {
    expect(adocToDefaultHtml(Examples.textFormatNestedAdoc)).toEqual(Examples.textFormatNestedHtml);
    expect(toTinyHtml(Examples.textFormatNestedAdoc)).toEqual(Examples.textFormatNestedTiny);
  });
  it('textFormatLiteralMonospace', () => {
    expect(adocToDefaultHtml(Examples.textFormatLiteralMonospaceAdoc)).toEqual(Examples.textFormatLiteralMonospaceHtml);
    expect(toTinyHtml(Examples.textFormatLiteralMonospaceAdoc)).toEqual(Examples.textFormatLiteralMonospaceTiny);
  });
  it('textFormatCustomSpan', () => {
    expect(adocToDefaultHtml(Examples.textFormatCustomSpanAdoc)).toEqual(Examples.textFormatCustomSpanHtml);
    expect(toTinyHtml(Examples.textFormatCustomSpanAdoc)).toEqual(Examples.textFormatCustomSpanTiny);
  });
  it('autoLinks', () => {
    expect(adocToDefaultHtml(Examples.autoLinksAdoc)).toEqual(Examples.autoLinksHtml);
    expect(toTinyHtml(Examples.autoLinksAdoc)).toEqual(Examples.autoLinksTiny);
  });
  it('enclosedLink', () => {
    expect(adocToDefaultHtml(Examples.enclosedLinkAdoc)).toEqual(Examples.enclosedLinkHtml);
    expect(toTinyHtml(Examples.enclosedLinkAdoc)).toEqual(Examples.enclosedLinkTiny);
  });
  it('autoLinkEscaped', () => {
    expect(adocToDefaultHtml(Examples.autoLinkEscapedAdoc)).toEqual(Examples.autoLinkEscapedHtml);
    expect(toTinyHtml(Examples.autoLinkEscapedAdoc)).toEqual(Examples.autoLinkEscapedTiny);
  });
  it('urlMacro', () => {
    expect(adocToDefaultHtml(Examples.urlMacroAdoc)).toEqual(Examples.urlMacroHtml);
    expect(toTinyHtml(Examples.urlMacroAdoc)).toEqual(Examples.urlMacroTiny);
  });
  it('textInterpolation', () => {
    expect(adocToDefaultHtml(Examples.textInterpolationAdoc)).toEqual(Examples.textInterpolationHtml);
    expect(toTinyHtml(Examples.textInterpolationAdoc)).toEqual(Examples.textInterpolationTiny);
  });
  it('crossReferenceBasic', () => {
    expect(adocToDefaultHtml(Examples.crossReferenceBasicAdoc)).toEqual(Examples.crossReferenceBasicHtml);
    expect(toTinyHtml(Examples.crossReferenceBasicAdoc)).toEqual(Examples.crossReferenceBasicTiny);
  });
  it('crossReferenceWithTitle', () => {
    expect(adocToDefaultHtml(Examples.crossReferenceWithTitleAdoc)).toEqual(Examples.crossReferenceWithTitleHtml);
    expect(toTinyHtml(Examples.crossReferenceWithTitleAdoc)).toEqual(Examples.crossReferenceWithTitleTiny);
  });
  it('crossReferenceNature', () => {
    expect(adocToDefaultHtml(Examples.crossReferenceNatureAdoc)).toEqual(Examples.crossReferenceNatureHtml);
    expect(toTinyHtml(Examples.crossReferenceNatureAdoc)).toEqual(Examples.crossReferenceNatureTiny);
  });
  it('crossReferenceToOtherDocument', () => {
    expect(adocToDefaultHtml(Examples.crossReferenceToOtherDocumentAdoc)).toEqual(Examples.crossReferenceToOtherDocumentHtml);
    expect(toTinyHtml(Examples.crossReferenceToOtherDocumentAdoc)).toEqual(Examples.crossReferenceToOtherDocumentTiny);
  });
  it('footnotes', () => {
    expect(adocToDefaultHtml(Examples.footnotesAdoc)).toEqual(Examples.footnotesHtml);
    expect(toTinyHtml(Examples.footnotesAdoc)).toEqual(Examples.footnotesTiny);
  });
  it('imageBlock', () => {
    expect(adocToDefaultHtml(Examples.imageBlockAdoc)).toEqual(Examples.imageBlockHtml);
    expect(toTinyHtml(Examples.imageBlockAdoc)).toEqual(Examples.imageBlockTiny);
  });
  it('imageInline', () => {
    expect(adocToDefaultHtml(Examples.imageInlineAdoc)).toEqual(Examples.imageInlineHtml);
    expect(toTinyHtml(Examples.imageInlineAdoc)).toEqual(Examples.imageInlineTiny);
  });
  it('imageBlockWithTitleAndAttributes', () => {
    expect(adocToDefaultHtml(Examples.imageBlockWithTitleAndAttributesAdoc)).toEqual(Examples.imageBlockWithTitleAndAttributesHtml);
    expect(toTinyHtml(Examples.imageBlockWithTitleAndAttributesAdoc)).toEqual(Examples.imageBlockWithTitleAndAttributesTiny);
  });
  it('imageWithPositionalAttributes', () => {
    expect(adocToDefaultHtml(Examples.imageWithPositionalAttributesAdoc)).toEqual(Examples.imageWithPositionalAttributesHtml);
    expect(toTinyHtml(Examples.imageWithPositionalAttributesAdoc)).toEqual(Examples.imageWithPositionalAttributesTiny);
  });
  it('video', () => {
    expect(adocToDefaultHtml(Examples.videoAdoc)).toEqual(Examples.videoHtml);
    expect(toTinyHtml(Examples.videoAdoc)).toEqual(Examples.videoTiny);
  });
  it('icon', () => {
    expect(adocToDefaultHtml(Examples.iconAdoc)).toEqual(Examples.iconHtml);
    expect(toTinyHtml(Examples.iconAdoc)).toEqual(Examples.iconTiny);
  });
  it('keyboardMacro', () => {
    expect(adocToDefaultHtml(Examples.keyboardMacroAdoc)).toEqual(Examples.keyboardMacroHtml);
    expect(toTinyHtml(Examples.keyboardMacroAdoc)).toEqual(Examples.keyboardMacroTiny);
  });
  it('buttonMacro', () => {
    expect(adocToDefaultHtml(Examples.buttonMacroAdoc)).toEqual(Examples.buttonMacroHtml);
    expect(toTinyHtml(Examples.buttonMacroAdoc)).toEqual(Examples.buttonMacroTiny);
  });
  it('menuMacro', () => {
    expect(adocToDefaultHtml(Examples.menuMacroAdoc)).toEqual(Examples.menuMacroHtml);
    expect(toTinyHtml(Examples.menuMacroAdoc)).toEqual(Examples.menuMacroTiny);
  });
  it('admonitionSimple', () => {
    expect(adocToDefaultHtml(Examples.admonitionSimpleAdoc)).toEqual(Examples.admonitionSimpleHtml);
    expect(toTinyHtml(Examples.admonitionSimpleAdoc)).toEqual(Examples.admonitionSimpleTiny);
  });
  it('admonitionComplex', () => {
    expect(adocToDefaultHtml(Examples.admonitionComplexAdoc)).toEqual(Examples.admonitionComplexHtml);
    expect(toTinyHtml(Examples.admonitionComplexAdoc)).toEqual(Examples.admonitionComplexTiny);
  });
  it('sidebarSimple', () => {
    expect(adocToDefaultHtml(Examples.sidebarSimpleAdoc)).toEqual(Examples.sidebarSimpleHtml);
    expect(toTinyHtml(Examples.sidebarSimpleAdoc)).toEqual(Examples.sidebarSimpleTiny);
  });
  it('sidebarComplex', () => {
    expect(adocToDefaultHtml(Examples.sidebarComplexAdoc)).toEqual(Examples.sidebarComplexHtml);
    expect(toTinyHtml(Examples.sidebarComplexAdoc)).toEqual(Examples.sidebarComplexTiny);
  });
  it('exampleBlockSimple', () => {
    expect(adocToDefaultHtml(Examples.exampleBlockSimpleAdoc)).toEqual(Examples.exampleBlockSimpleHtml);
    expect(toTinyHtml(Examples.exampleBlockSimpleAdoc)).toEqual(Examples.exampleBlockSimpleTiny);
  });
  it('exampleBlockComplex', () => {
    expect(adocToDefaultHtml(Examples.exampleBlockComplexAdoc)).toEqual(Examples.exampleBlockComplexHtml);
    expect(toTinyHtml(Examples.exampleBlockComplexAdoc)).toEqual(Examples.exampleBlockComplexTiny);
  });
  it('blockQuoteSimple', () => {
    expect(adocToDefaultHtml(Examples.blockQuoteSimpleAdoc)).toEqual(Examples.blockQuoteSimpleHtml);
    expect(toTinyHtml(Examples.blockQuoteSimpleAdoc)).toEqual(Examples.blockQuoteSimpleTiny);
  });
  it('blockQuoteHighlight', () => {
    expect(adocToDefaultHtml(Examples.blockQuoteHighlightAdoc)).toEqual(Examples.blockQuoteHighlightHtml);
    expect(toTinyHtml(Examples.blockQuoteHighlightAdoc)).toEqual(Examples.blockQuoteHighlightTiny);
  });
  it('blockQuoteShorthand', () => {
    expect(adocToDefaultHtml(Examples.blockQuoteShorthandAdoc)).toEqual(Examples.blockQuoteShorthandHtml);
    expect(toTinyHtml(Examples.blockQuoteShorthandAdoc)).toEqual(Examples.blockQuoteShorthandTiny);
  });
  it('blockQuoteMarkdown', () => {
    expect(adocToDefaultHtml(Examples.blockQuoteMarkdownAdoc)).toEqual(Examples.blockQuoteMarkdownHtml);
    expect(toTinyHtml(Examples.blockQuoteMarkdownAdoc)).toEqual(Examples.blockQuoteMarkdownTiny);
  });
  it('verse', () => {
    expect(adocToDefaultHtml(Examples.verseAdoc)).toEqual(Examples.verseHtml);
    expect(toTinyHtml(Examples.verseAdoc)).toEqual(Examples.verseTiny);
  });
  it('sourceCodeSimple', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeSimpleAdoc)).toEqual(Examples.sourceCodeSimpleHtml);
    expect(toTinyHtml(Examples.sourceCodeSimpleAdoc)).toEqual(Examples.sourceCodeSimpleTiny);
  });
  it('sourceCodeNoIndent', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeNoIndentAdoc)).toEqual(Examples.sourceCodeNoIndentHtml);
    expect(toTinyHtml(Examples.sourceCodeNoIndentAdoc)).toEqual(Examples.sourceCodeNoIndentTiny);
  });
  it('sourceCodeHighlight', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeHighlightAdoc)).toEqual(Examples.sourceCodeHighlightHtml);
    expect(toTinyHtml(Examples.sourceCodeHighlightAdoc)).toEqual(Examples.sourceCodeHighlightTiny);
  });
  it('sourceCodeHighlightLines', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeHighlightLinesAdoc)).toEqual(Examples.sourceCodeHighlightLinesHtml);
    expect(toTinyHtml(Examples.sourceCodeHighlightLinesAdoc)).toEqual(Examples.sourceCodeHighlightLinesTiny);
  });
  it('listingBlock', () => {
    expect(adocToDefaultHtml(Examples.listingBlockAdoc)).toEqual(Examples.listingBlockHtml);
    expect(toTinyHtml(Examples.listingBlockAdoc)).toEqual(Examples.listingBlockTiny);
  });
  it('literalBlockWithStyle', () => {
    expect(adocToDefaultHtml(Examples.literalBlockWithStyleAdoc)).toEqual(Examples.literalBlockWithStyleHtml);
    expect(toTinyHtml(Examples.literalBlockWithStyleAdoc)).toEqual(Examples.literalBlockWithStyleTiny);
  });
  it('literalBlockWithDelimiter', () => {
    expect(adocToDefaultHtml(Examples.literalBlockWithDelimiterAdoc)).toEqual(Examples.literalBlockWithDelimiterHtml);
    expect(toTinyHtml(Examples.literalBlockWithDelimiterAdoc)).toEqual(Examples.literalBlockWithDelimiterTiny);
  });
  it('sourceCodeCallouts', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeCalloutsAdoc)).toEqual(Examples.sourceCodeCalloutsHtml);
    expect(toTinyHtml(Examples.sourceCodeCalloutsAdoc)).toEqual(Examples.sourceCodeCalloutsTiny);
  });
  it('sourceCodeWithIndent', () => {
    expect(adocToDefaultHtml(Examples.sourceCodeWithIndentAdoc)).toEqual(Examples.sourceCodeWithIndentHtml);
    expect(toTinyHtml(Examples.sourceCodeWithIndentAdoc)).toEqual(Examples.sourceCodeWithIndentTiny);
  });
  it('tableEmpty', () => {
    expect(adocToDefaultHtml(Examples.tableEmptyAdoc)).toEqual(Examples.tableEmptyHtml);
    expect(toTinyHtml(Examples.tableEmptyAdoc)).toEqual(Examples.tableEmptyTiny);
  });
  it('tableWithTitle', () => {
    expect(adocToDefaultHtml(Examples.tableWithTitleAdoc)).toEqual(Examples.tableWithTitleHtml);
    expect(toTinyHtml(Examples.tableWithTitleAdoc)).toEqual(Examples.tableWithTitleTiny);
  });
  it('tableWithoutHeader', () => {
    expect(adocToDefaultHtml(Examples.tableWithoutHeaderAdoc)).toEqual(Examples.tableWithoutHeaderHtml);
    expect(toTinyHtml(Examples.tableWithoutHeaderAdoc)).toEqual(Examples.tableWithoutHeaderTiny);
  });
  it('tableWithHeader', () => {
    expect(adocToDefaultHtml(Examples.tableWithHeaderAdoc)).toEqual(Examples.tableWithHeaderHtml);
    expect(toTinyHtml(Examples.tableWithHeaderAdoc)).toEqual(Examples.tableWithHeaderTiny);
  });
  it('tableAlignment', () => {
    expect(adocToDefaultHtml(Examples.tableAlignmentAdoc)).toEqual(Examples.tableAlignmentHtml);
    expect(toTinyHtml(Examples.tableAlignmentAdoc)).toEqual(Examples.tableAlignmentTiny);
  });
  it('tableFormatCellContent', () => {
    expect(adocToDefaultHtml(Examples.tableFormatCellContentAdoc)).toEqual(Examples.tableFormatCellContentHtml);
    expect(toTinyHtml(Examples.tableFormatCellContentAdoc)).toEqual(Examples.tableFormatCellContentTiny);
  });
  it('tableOverrideStyle', () => {
    expect(adocToDefaultHtml(Examples.tableOverrideStyleAdoc)).toEqual(Examples.tableOverrideStyleHtml);
    expect(toTinyHtml(Examples.tableOverrideStyleAdoc)).toEqual(Examples.tableOverrideStyleTiny);
  });
  it('tableAdocBlockInCell', () => {
    expect(adocToDefaultHtml(Examples.tableAdocBlockInCellAdoc)).toEqual(Examples.tableAdocBlockInCellHtml);
    expect(toTinyHtml(Examples.tableAdocBlockInCellAdoc)).toEqual(Examples.tableAdocBlockInCellTiny);
  });
  it('tableColSpanAndRowSpan', () => {
    expect(adocToDefaultHtml(Examples.tableColSpanAndRowSpanAdoc)).toEqual(Examples.tableColSpanAndRowSpanHtml);
    expect(toTinyHtml(Examples.tableColSpanAndRowSpanAdoc)).toEqual(Examples.tableColSpanAndRowSpanTiny);
  });
  it('tableWidth', () => {
    expect(adocToDefaultHtml(Examples.tableWidthAdoc)).toEqual(Examples.tableWidthHtml);
    expect(toTinyHtml(Examples.tableWidthAdoc)).toEqual(Examples.tableWidthTiny);
  });
  it('tableCustomSeparator', () => {
    expect(adocToDefaultHtml(Examples.tableCustomSeparatorAdoc)).toEqual(Examples.tableCustomSeparatorHtml);
    expect(toTinyHtml(Examples.tableCustomSeparatorAdoc)).toEqual(Examples.tableCustomSeparatorTiny);
  });
  it('tableCsv', () => {
    expect(adocToDefaultHtml(Examples.tableCsvAdoc)).toEqual(Examples.tableCsvHtml);
    expect(toTinyHtml(Examples.tableCsvAdoc)).toEqual(Examples.tableCsvTiny);
  });
  it('tableEscapePipeChar', () => {
    expect(adocToDefaultHtml(Examples.tableEscapePipeCharAdoc)).toEqual(Examples.tableEscapePipeCharHtml);
    expect(toTinyHtml(Examples.tableEscapePipeCharAdoc)).toEqual(Examples.tableEscapePipeCharTiny);
  });
  it('stemInline', () => {
    expect(adocToDefaultHtml(Examples.stemInlineAdoc)).toEqual(Examples.stemInlineHtml);
    expect(toTinyHtml(Examples.stemInlineAdoc)).toEqual(Examples.stemInlineTiny);
  });
  it('stemBlock', () => {
    expect(adocToDefaultHtml(Examples.stemBlockAdoc)).toEqual(Examples.stemBlockHtml);
    expect(toTinyHtml(Examples.stemBlockAdoc)).toEqual(Examples.stemBlockTiny);
  });
  it('stemMixed', () => {
    expect(adocToDefaultHtml(Examples.stemMixedAdoc)).toEqual(Examples.stemMixedHtml);
    expect(toTinyHtml(Examples.stemMixedAdoc)).toEqual(Examples.stemMixedTiny);
  });
  it('openBlockSimple', () => {
    expect(adocToDefaultHtml(Examples.openBlockSimpleAdoc)).toEqual(Examples.openBlockSimpleHtml);
    expect(toTinyHtml(Examples.openBlockSimpleAdoc)).toEqual(Examples.openBlockSimpleTiny);
  });
  it('openBlockComplex', () => {
    expect(adocToDefaultHtml(Examples.openBlockComplexAdoc)).toEqual(Examples.openBlockComplexHtml);
    expect(toTinyHtml(Examples.openBlockComplexAdoc)).toEqual(Examples.openBlockComplexTiny);
  });
  it('includeSimple', () => {
    expect(adocToDefaultHtml(Examples.includeSimpleAdoc)).toEqual(Examples.includeSimpleHtml);
    expect(toTinyHtml(Examples.includeSimpleAdoc)).toEqual(Examples.includeSimpleTiny);
  });
  it('includeWithAttributes', () => {
    expect(adocToDefaultHtml(Examples.includeWithAttributesAdoc)).toEqual(Examples.includeWithAttributesHtml);
    expect(toTinyHtml(Examples.includeWithAttributesAdoc)).toEqual(Examples.includeWithAttributesTiny);
  });
  it('includeUnresolvedDirective', () => {
    expect(adocToDefaultHtml(Examples.includeUnresolvedDirectiveAdoc)).toEqual(Examples.includeUnresolvedDirectiveHtml);
    expect(toTinyHtml(Examples.includeUnresolvedDirectiveAdoc)).toEqual(Examples.includeUnresolvedDirectiveTiny);
  });
  it('escapeSimple', () => {
    expect(adocToDefaultHtml(Examples.escapeSimpleAdoc)).toEqual(Examples.escapeSimpleHtml);
    expect(toTinyHtml(Examples.escapeSimpleAdoc)).toEqual(Examples.escapeSimpleTiny);
  });
  it('escapePlus', () => {
    expect(adocToDefaultHtml(Examples.escapePlusAdoc)).toEqual(Examples.escapePlusHtml);
    expect(toTinyHtml(Examples.escapePlusAdoc)).toEqual(Examples.escapePlusTiny);
  });
  it('escapeStarStar', () => {
    expect(adocToDefaultHtml(Examples.escapeStarStarAdoc)).toEqual(Examples.escapeStarStarHtml);
    expect(toTinyHtml(Examples.escapeStarStarAdoc)).toEqual(Examples.escapeStarStarTiny);
  });
  it('escapeDollarBrace', () => {
    expect(adocToDefaultHtml(Examples.escapeDollarBraceAdoc)).toEqual(Examples.escapeDollarBraceHtml);
    expect(toTinyHtml(Examples.escapeDollarBraceAdoc)).toEqual(Examples.escapeDollarBraceTiny);
  });
  it('conditionalDirective', () => {
    expect(adocToDefaultHtml(Examples.conditionalDirectiveAdoc)).toEqual(Examples.conditionalDirectiveHtml);
    expect(toTinyHtml(Examples.conditionalDirectiveAdoc)).toEqual(Examples.conditionalDirectiveTiny);
  });
});
