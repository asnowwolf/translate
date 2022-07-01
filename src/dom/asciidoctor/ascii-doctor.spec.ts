import { AdocBuilder } from './adoc-builder/adoc-builder';
import { Examples } from './utils/examples';

function rebuild(content: string): string {
  const compiler = new AdocBuilder();
  const doc = compiler.parse(content);
  return compiler.build(doc);
}

describe('ascii-doctor', () => {
  it('document', () => {
    expect(rebuild(Examples.documentAdoc)).toEqual(Examples.documentNormalized);
  });
  it('documentWithPreamble', () => {
    expect(rebuild(Examples.documentWithPreambleAdoc)).toEqual(Examples.documentWithPreambleNormalized);
  });
  it('paragraph', () => {
    expect(rebuild(Examples.paragraphAdoc)).toEqual(Examples.paragraphNormalized);
  });
  it('sectionSimple', () => {
    expect(rebuild(Examples.sectionSimpleAdoc)).toEqual(Examples.sectionSimpleNormalized);
  });
  it('floatingTitle', () => {
    expect(rebuild(Examples.floatingTitleAdoc)).toEqual(Examples.floatingTitleNormalized);
  });
  it('sectionWithTitleAndAttributes', () => {
    expect(rebuild(Examples.sectionWithTitleAndAttributesAdoc)).toEqual(Examples.sectionWithTitleAndAttributesNormalized);
  });
  it('indexTermBlockSimple', () => {
    expect(rebuild(Examples.indexTermBlockSimpleAdoc)).toEqual(Examples.indexTermBlockSimpleNormalized);
  });
  it('indexTermBlockComplex', () => {
    expect(rebuild(Examples.indexTermBlockComplexAdoc)).toEqual(Examples.indexTermBlockComplexNormalized);
  });
  it('indexTermInline', () => {
    expect(rebuild(Examples.indexTermInlineAdoc)).toEqual(Examples.indexTermInlineNormalized);
  });
  it('breakThematic1', () => {
    expect(rebuild(Examples.breakThematic1Adoc)).toEqual(Examples.breakThematic1Normalized);
  });
  it('breakThematic2', () => {
    expect(rebuild(Examples.breakThematic2Adoc)).toEqual(Examples.breakThematic2Normalized);
  });
  it('breakThematic3', () => {
    expect(rebuild(Examples.breakThematic3Adoc)).toEqual(Examples.breakThematic3Normalized);
  });
  it('breakThematic4', () => {
    expect(rebuild(Examples.breakThematic4Adoc)).toEqual(Examples.breakThematic4Normalized);
  });
  it('breakThematic5', () => {
    expect(rebuild(Examples.breakThematic5Adoc)).toEqual(Examples.breakThematic5Normalized);
  });
  it('breakPage', () => {
    expect(rebuild(Examples.breakPageAdoc)).toEqual(Examples.breakPageNormalized);
  });
  it('unorderedListSimple', () => {
    expect(rebuild(Examples.unorderedListSimpleAdoc)).toEqual(Examples.unorderedListSimpleNormalized);
  });
  it('unorderedListWithParagraphs', () => {
    expect(rebuild(Examples.unorderedListWithParagraphsAdoc)).toEqual(Examples.unorderedListWithParagraphsNormalized);
  });
  it('orderedList', () => {
    expect(rebuild(Examples.orderedListAdoc)).toEqual(Examples.orderedListNormalized);
  });
  it('mixedList', () => {
    expect(rebuild(Examples.mixedListAdoc)).toEqual(Examples.mixedListNormalized);
  });
  it('descriptionListSimple', () => {
    expect(rebuild(Examples.descriptionListSimpleAdoc)).toEqual(Examples.descriptionListSimpleNormalized);
  });
  it('descriptionListComplex', () => {
    expect(rebuild(Examples.descriptionListComplexAdoc)).toEqual(Examples.descriptionListComplexNormalized);
  });
  it('listContinuation', () => {
    expect(rebuild(Examples.listContinuationAdoc)).toEqual(Examples.listContinuationNormalized);
  });
  it('textFormatSimple', () => {
    expect(rebuild(Examples.textFormatSimpleAdoc)).toEqual(Examples.textFormatSimpleAdoc);
  });
  it('textFormatNested', () => {
    expect(rebuild(Examples.textFormatNestedAdoc)).toEqual(Examples.textFormatNestedNormalized);
  });
  it('textFormatLiteralMonospace', () => {
    expect(rebuild(Examples.textFormatLiteralMonospaceAdoc)).toEqual(Examples.textFormatLiteralMonospaceNormalized);
  });
  it('textFormatCustomSpan', () => {
    expect(rebuild(Examples.textFormatCustomSpanAdoc)).toEqual(Examples.textFormatCustomSpanNormalized);
  });
  it('autoLinks', () => {
    expect(rebuild(Examples.autoLinksAdoc)).toEqual(Examples.autoLinksNormalized);
  });
  it('enclosedLink', () => {
    expect(rebuild(Examples.enclosedLinkAdoc)).toEqual(Examples.enclosedLinkNormalized);
  });
  it('autoLinkEscaped', () => {
    expect(rebuild(Examples.autoLinkEscapedAdoc)).toEqual(Examples.autoLinkEscapedNormalized);
  });
  it('urlMacro', () => {
    expect(rebuild(Examples.urlMacroAdoc)).toEqual(Examples.urlMacroNormalized);
  });
  it('textInterpolation', () => {
    expect(rebuild(Examples.textInterpolationAdoc)).toEqual(Examples.textInterpolationNormalized);
  });
  it('crossReferenceBasic', () => {
    expect(rebuild(Examples.crossReferenceBasicAdoc)).toEqual(Examples.crossReferenceBasicNormalized);
  });
  it('crossReferenceWithTitle', () => {
    expect(rebuild(Examples.crossReferenceWithTitleAdoc)).toEqual(Examples.crossReferenceWithTitleNormalized);
  });
  it('crossReferenceNature', () => {
    expect(rebuild(Examples.crossReferenceNatureAdoc)).toEqual(Examples.crossReferenceNatureNormalized);
  });
  it('crossReferenceToOtherDocument', () => {
    expect(rebuild(Examples.crossReferenceToOtherDocumentAdoc)).toEqual(Examples.crossReferenceToOtherDocumentNormalized);
  });
  it('footnotes', () => {
    expect(rebuild(Examples.footnotesAdoc)).toEqual(Examples.footnotesNormalized);
  });
  it('imageBlock', () => {
    expect(rebuild(Examples.imageBlockAdoc)).toEqual(Examples.imageBlockNormalized);
  });
  it('imageInline', () => {
    expect(rebuild(Examples.imageInlineAdoc)).toEqual(Examples.imageInlineNormalized);
  });
  it('imageBlockWithTitleAndAttributes', () => {
    expect(rebuild(Examples.imageBlockWithTitleAndAttributesAdoc)).toEqual(Examples.imageBlockWithTitleAndAttributesNormalized);
  });
  it('imageWithPositionalAttributes', () => {
    expect(rebuild(Examples.imageWithPositionalAttributesAdoc)).toEqual(Examples.imageWithPositionalAttributesNormalized);
  });
  it('video', () => {
    expect(rebuild(Examples.videoAdoc)).toEqual(Examples.videoNormalized);
  });
  it('icon', () => {
    expect(rebuild(Examples.iconAdoc)).toEqual(Examples.iconNormalized);
  });
  it('keyboardMacro', () => {
    expect(rebuild(Examples.keyboardMacroAdoc)).toEqual(Examples.keyboardMacroNormalized);
  });
  it('buttonMacro', () => {
    expect(rebuild(Examples.buttonMacroAdoc)).toEqual(Examples.buttonMacroNormalized);
  });
  it('menuMacro', () => {
    expect(rebuild(Examples.menuMacroAdoc)).toEqual(Examples.menuMacroNormalized);
  });
  it('admonitionSimple', () => {
    expect(rebuild(Examples.admonitionSimpleAdoc)).toEqual(Examples.admonitionSimpleNormalized);
  });
  it('admonitionComplex', () => {
    expect(rebuild(Examples.admonitionComplexAdoc)).toEqual(Examples.admonitionComplexNormalized);
  });
  it('sidebarSimple', () => {
    expect(rebuild(Examples.sidebarSimpleAdoc)).toEqual(Examples.sidebarSimpleNormalized);
  });
  it('sidebarComplex', () => {
    expect(rebuild(Examples.sidebarComplexAdoc)).toEqual(Examples.sidebarComplexNormalized);
  });
  it('exampleBlockSimple', () => {
    expect(rebuild(Examples.exampleBlockSimpleAdoc)).toEqual(Examples.exampleBlockSimpleNormalized);
  });
  it('exampleBlockComplex', () => {
    expect(rebuild(Examples.exampleBlockComplexAdoc)).toEqual(Examples.exampleBlockComplexNormalized);
  });
  it('blockQuoteSimple', () => {
    expect(rebuild(Examples.blockQuoteSimpleAdoc)).toEqual(Examples.blockQuoteSimpleNormalized);
  });
  it('blockQuoteHighlight', () => {
    expect(rebuild(Examples.blockQuoteHighlightAdoc)).toEqual(Examples.blockQuoteHighlightNormalized);
  });
  it('blockQuoteShorthand', () => {
    expect(rebuild(Examples.blockQuoteShorthandAdoc)).toEqual(Examples.blockQuoteShorthandNormalized);
  });
  it('blockQuoteMarkdown', () => {
    expect(rebuild(Examples.blockQuoteMarkdownAdoc)).toEqual(Examples.blockQuoteMarkdownNormalized);
  });
  it('verse', () => {
    expect(rebuild(Examples.verseAdoc)).toEqual(Examples.verseNormalized);
  });
  it('sourceCodeSimple', () => {
    expect(rebuild(Examples.sourceCodeSimpleAdoc)).toEqual(Examples.sourceCodeSimpleNormalized);
  });
  it('sourceCodeNoIndent', () => {
    expect(rebuild(Examples.sourceCodeNoIndentAdoc)).toEqual(Examples.sourceCodeNoIndentNormalized);
  });
  it('sourceCodeHighlight', () => {
    expect(rebuild(Examples.sourceCodeHighlightAdoc)).toEqual(Examples.sourceCodeHighlightNormalized);
  });
  it('sourceCodeHighlightLines', () => {
    expect(rebuild(Examples.sourceCodeHighlightLinesAdoc)).toEqual(Examples.sourceCodeHighlightLinesNormalized);
  });
  it('listingBlock', () => {
    expect(rebuild(Examples.listingBlockAdoc)).toEqual(Examples.listingBlockNormalized);
  });
  it('literalBlockWithStyle', () => {
    expect(rebuild(Examples.literalBlockWithStyleAdoc)).toEqual(Examples.literalBlockWithStyleNormalized);
  });
  it('literalBlockWithDelimiter', () => {
    expect(rebuild(Examples.literalBlockWithDelimiterAdoc)).toEqual(Examples.literalBlockWithDelimiterNormalized);
  });
  it('sourceCodeCallouts', () => {
    expect(rebuild(Examples.sourceCodeCalloutsAdoc)).toEqual(Examples.sourceCodeCalloutsNormalized);
  });
  it('sourceCodeWithIndent', () => {
    expect(rebuild(Examples.sourceCodeWithIndentAdoc)).toEqual(Examples.sourceCodeWithIndentNormalized);
  });
  it('tableEmpty', () => {
    expect(rebuild(Examples.tableEmptyAdoc)).toEqual(Examples.tableEmptyNormalized);
  });
  it('tableWithTitle', () => {
    expect(rebuild(Examples.tableWithTitleAdoc)).toEqual(Examples.tableWithTitleNormalized);
  });
  it('tableWithoutHeader', () => {
    expect(rebuild(Examples.tableWithoutHeaderAdoc)).toEqual(Examples.tableWithoutHeaderNormalized);
  });
  it('tableWithHeader', () => {
    expect(rebuild(Examples.tableWithHeaderAdoc)).toEqual(Examples.tableWithHeaderNormalized);
  });
  it('tableAlignment', () => {
    expect(rebuild(Examples.tableAlignmentAdoc)).toEqual(Examples.tableAlignmentNormalized);
  });
  it('tableFormatCellContent', () => {
    expect(rebuild(Examples.tableFormatCellContentAdoc)).toEqual(Examples.tableFormatCellContentNormalized);
  });
  it('tableOverrideStyle', () => {
    expect(rebuild(Examples.tableOverrideStyleAdoc)).toEqual(Examples.tableOverrideStyleNormalized);
  });
  it('tableAdocBlockInCell', () => {
    expect(rebuild(Examples.tableAdocBlockInCellAdoc)).toEqual(Examples.tableAdocBlockInCellNormalized);
  });
  it('tableColSpanAndRowSpan', () => {
    expect(rebuild(Examples.tableColSpanAndRowSpanAdoc)).toEqual(Examples.tableColSpanAndRowSpanNormalized);
  });
  it('tableWidth', () => {
    expect(rebuild(Examples.tableWidthAdoc)).toEqual(Examples.tableWidthNormalized);
  });
  it('tableCustomSeparator', () => {
    expect(rebuild(Examples.tableCustomSeparatorAdoc)).toEqual(Examples.tableCustomSeparatorNormalized);
  });
  xit('tableCsv', () => {
    expect(rebuild(Examples.tableCsvAdoc)).toEqual(Examples.tableCsvNormalized);
  });
  it('tableEscapePipeChar', () => {
    expect(rebuild(Examples.tableEscapePipeCharAdoc)).toEqual(Examples.tableEscapePipeCharNormalized);
  });
  it('stemInline', () => {
    expect(rebuild(Examples.stemInlineAdoc)).toEqual(Examples.stemInlineNormalized);
  });
  it('stemBlock', () => {
    expect(rebuild(Examples.stemBlockAdoc)).toEqual(Examples.stemBlockNormalized);
  });
  it('stemMixed', () => {
    expect(rebuild(Examples.stemMixedAdoc)).toEqual(Examples.stemMixedNormalized);
  });
  it('openBlockSimple', () => {
    expect(rebuild(Examples.openBlockSimpleAdoc)).toEqual(Examples.openBlockSimpleNormalized);
  });
  xit('openBlockComplex', () => {
    expect(rebuild(Examples.openBlockComplexAdoc)).toEqual(Examples.openBlockComplexNormalized);
  });
  it('includeSimple', () => {
    expect(rebuild(Examples.includeSimpleAdoc)).toEqual(Examples.includeSimpleNormalized);
  });
  it('includeWithAttributes', () => {
    expect(rebuild(Examples.includeWithAttributesAdoc)).toEqual(Examples.includeWithAttributesNormalized);
  });
  it('includeUnresolvedDirective', () => {
    expect(rebuild(Examples.includeUnresolvedDirectiveAdoc)).toEqual(Examples.includeUnresolvedDirectiveNormalized);
  });
  it('escapeSimple', () => {
    expect(rebuild(Examples.escapeSimpleAdoc)).toEqual(Examples.escapeSimpleNormalized);
  });
  it('escapePlus', () => {
    expect(rebuild(Examples.escapePlusAdoc)).toEqual(Examples.escapePlusNormalized);
  });
  it('escapeStarStar', () => {
    expect(rebuild(Examples.escapeStarStarAdoc)).toEqual(Examples.escapeStarStarNormalized);
  });
  it('escapeDollarBrace', () => {
    expect(rebuild(Examples.escapeDollarBraceAdoc)).toEqual(Examples.escapeDollarBraceNormalized);
  });
  it('conditionalDirective', () => {
    expect(rebuild(Examples.conditionalDirectiveAdoc)).toEqual(Examples.conditionalDirectiveNormalized);
  });
});
