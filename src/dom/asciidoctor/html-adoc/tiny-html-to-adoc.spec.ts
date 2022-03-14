import { Examples } from '../utils/examples';
import { tinyHtmlToAdoc } from './tiny-html-to-adoc';

describe('tiny html to adoc', () => {
  // TODO: 实现它
  xdescribe('blocks', () => {
    it('document', () => {
      expect(tinyHtmlToAdoc(Examples.documentTiny)).toEqual(Examples.documentAdoc);
    });
    it('documentWithPreamble', () => {
      expect(tinyHtmlToAdoc(Examples.documentWithPreambleTiny)).toEqual(Examples.documentWithPreambleAdoc);
    });
    it('paragraph', () => {
      expect(tinyHtmlToAdoc(Examples.paragraphTiny)).toEqual(Examples.paragraphAdoc);
    });
    it('sectionSimple', () => {
      expect(tinyHtmlToAdoc(Examples.sectionSimpleTiny)).toEqual(Examples.sectionSimpleAdoc);
    });
    it('floatingTitle', () => {
      expect(tinyHtmlToAdoc(Examples.floatingTitleTiny)).toEqual(Examples.floatingTitleAdoc);
    });
    it('sectionWithTitleAndAttributes', () => {
      expect(tinyHtmlToAdoc(Examples.sectionWithTitleAndAttributesTiny)).toEqual(Examples.sectionWithTitleAndAttributesAdoc);
    });
    it('indexTermBlockSimple', () => {
      expect(tinyHtmlToAdoc(Examples.indexTermBlockSimpleTiny)).toEqual(Examples.indexTermBlockSimpleAdoc);
    });
    it('indexTermBlockComplex', () => {
      expect(tinyHtmlToAdoc(Examples.indexTermBlockComplexTiny)).toEqual(Examples.indexTermBlockComplexAdoc);
    });
    it('indexTermInline', () => {
      expect(tinyHtmlToAdoc(Examples.indexTermInlineTiny)).toEqual(Examples.indexTermInlineAdoc);
    });
    it('breakThematic1', () => {
      expect(tinyHtmlToAdoc(Examples.breakThematic1Tiny)).toEqual(Examples.breakThematic1Adoc);
    });
    it('breakThematic2', () => {
      expect(tinyHtmlToAdoc(Examples.breakThematic2Tiny)).toEqual(Examples.breakThematic2Adoc);
    });
    it('breakThematic3', () => {
      expect(tinyHtmlToAdoc(Examples.breakThematic3Tiny)).toEqual(Examples.breakThematic3Adoc);
    });
    it('breakThematic4', () => {
      expect(tinyHtmlToAdoc(Examples.breakThematic4Tiny)).toEqual(Examples.breakThematic4Adoc);
    });
    it('breakThematic5', () => {
      expect(tinyHtmlToAdoc(Examples.breakThematic5Tiny)).toEqual(Examples.breakThematic5Adoc);
    });
    it('breakPage', () => {
      expect(tinyHtmlToAdoc(Examples.breakPageTiny)).toEqual(Examples.breakPageAdoc);
    });
    it('unorderedListSimple', () => {
      expect(tinyHtmlToAdoc(Examples.unorderedListSimpleTiny)).toEqual(Examples.unorderedListSimpleAdoc);
    });
    it('unorderedListWithParagraphs', () => {
      expect(tinyHtmlToAdoc(Examples.unorderedListWithParagraphsTiny)).toEqual(Examples.unorderedListWithParagraphsAdoc);
    });
    it('orderedList', () => {
      expect(tinyHtmlToAdoc(Examples.orderedListTiny)).toEqual(Examples.orderedListAdoc);
    });
    it('mixedList', () => {
      expect(tinyHtmlToAdoc(Examples.mixedListTiny)).toEqual(Examples.mixedListAdoc);
    });
    it('descriptionListSimple', () => {
      expect(tinyHtmlToAdoc(Examples.descriptionListSimpleTiny)).toEqual(Examples.descriptionListSimpleAdoc);
    });
    it('descriptionListComplex', () => {
      expect(tinyHtmlToAdoc(Examples.descriptionListComplexTiny)).toEqual(Examples.descriptionListComplexAdoc);
    });
    it('footnotes', () => {
      expect(tinyHtmlToAdoc(Examples.footnotesTiny)).toEqual(Examples.footnotesAdoc);
    });
    it('imageBlock', () => {
      expect(tinyHtmlToAdoc(Examples.imageBlockTiny)).toEqual(Examples.imageBlockAdoc);
    });
    it('imageBlockWithTitleAndAttributes', () => {
      expect(tinyHtmlToAdoc(Examples.imageBlockWithTitleAndAttributesTiny)).toEqual(Examples.imageBlockWithTitleAndAttributesAdoc);
    });
    it('imageWithPositionalAttributes', () => {
      expect(tinyHtmlToAdoc(Examples.imageWithPositionalAttributesTiny)).toEqual(Examples.imageWithPositionalAttributesAdoc);
    });
    it('video', () => {
      expect(tinyHtmlToAdoc(Examples.videoTiny)).toEqual(Examples.videoAdoc);
    });
    it('admonitionSimple', () => {
      expect(tinyHtmlToAdoc(Examples.admonitionSimpleTiny)).toEqual(Examples.admonitionSimpleAdoc);
    });
    it('admonitionComplex', () => {
      expect(tinyHtmlToAdoc(Examples.admonitionComplexTiny)).toEqual(Examples.admonitionComplexAdoc);
    });
    it('sidebarSimple', () => {
      expect(tinyHtmlToAdoc(Examples.sidebarSimpleTiny)).toEqual(Examples.sidebarSimpleAdoc);
    });
    it('sidebarComplex', () => {
      expect(tinyHtmlToAdoc(Examples.sidebarComplexTiny)).toEqual(Examples.sidebarComplexAdoc);
    });
    it('exampleBlockSimple', () => {
      expect(tinyHtmlToAdoc(Examples.exampleBlockSimpleTiny)).toEqual(Examples.exampleBlockSimpleAdoc);
    });
    it('exampleBlockComplex', () => {
      expect(tinyHtmlToAdoc(Examples.exampleBlockComplexTiny)).toEqual(Examples.exampleBlockComplexAdoc);
    });
    it('blockQuoteSimple', () => {
      expect(tinyHtmlToAdoc(Examples.blockQuoteSimpleTiny)).toEqual(Examples.blockQuoteSimpleAdoc);
    });
    it('blockQuoteHighlight', () => {
      expect(tinyHtmlToAdoc(Examples.blockQuoteHighlightTiny)).toEqual(Examples.blockQuoteHighlightAdoc);
    });
    it('blockQuoteShorthand', () => {
      expect(tinyHtmlToAdoc(Examples.blockQuoteShorthandTiny)).toEqual(Examples.blockQuoteShorthandAdoc);
    });
    it('blockQuoteMarkdown', () => {
      expect(tinyHtmlToAdoc(Examples.blockQuoteMarkdownTiny)).toEqual(Examples.blockQuoteMarkdownAdoc);
    });
    it('verse', () => {
      expect(tinyHtmlToAdoc(Examples.verseTiny)).toEqual(Examples.verseAdoc);
    });
    it('sourceCodeSimple', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeSimpleTiny)).toEqual(Examples.sourceCodeSimpleAdoc);
    });
    it('sourceCodeNoIndent', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeNoIndentTiny)).toEqual(Examples.sourceCodeNoIndentAdoc);
    });
    it('sourceCodeHighlight', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeHighlightTiny)).toEqual(Examples.sourceCodeHighlightAdoc);
    });
    it('sourceCodeHighlightLines', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeHighlightLinesTiny)).toEqual(Examples.sourceCodeHighlightLinesAdoc);
    });
    it('listingBlock', () => {
      expect(tinyHtmlToAdoc(Examples.listingBlockTiny)).toEqual(Examples.listingBlockAdoc);
    });
    it('literalBlockWithStyle', () => {
      expect(tinyHtmlToAdoc(Examples.literalBlockWithStyleTiny)).toEqual(Examples.literalBlockWithStyleAdoc);
    });
    it('literalBlockWithDelimiter', () => {
      expect(tinyHtmlToAdoc(Examples.literalBlockWithDelimiterTiny)).toEqual(Examples.literalBlockWithDelimiterAdoc);
    });
    it('sourceCodeCallouts', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeCalloutsTiny)).toEqual(Examples.sourceCodeCalloutsAdoc);
    });
    it('sourceCodeWithIndent', () => {
      expect(tinyHtmlToAdoc(Examples.sourceCodeWithIndentTiny)).toEqual(Examples.sourceCodeWithIndentAdoc);
    });
    it('tableEmpty', () => {
      expect(tinyHtmlToAdoc(Examples.tableEmptyTiny)).toEqual(Examples.tableEmptyAdoc);
    });
    it('tableWithTitle', () => {
      expect(tinyHtmlToAdoc(Examples.tableWithTitleTiny)).toEqual(Examples.tableWithTitleAdoc);
    });
    it('tableWithoutHeader', () => {
      expect(tinyHtmlToAdoc(Examples.tableWithoutHeaderTiny)).toEqual(Examples.tableWithoutHeaderAdoc);
    });
    it('tableWithHeader', () => {
      expect(tinyHtmlToAdoc(Examples.tableWithHeaderTiny)).toEqual(Examples.tableWithHeaderAdoc);
    });
    it('tableAlignment', () => {
      expect(tinyHtmlToAdoc(Examples.tableAlignmentTiny)).toEqual(Examples.tableAlignmentAdoc);
    });
    it('tableFormatCellContent', () => {
      expect(tinyHtmlToAdoc(Examples.tableFormatCellContentTiny)).toEqual(Examples.tableFormatCellContentAdoc);
    });
    it('tableOverrideStyle', () => {
      expect(tinyHtmlToAdoc(Examples.tableOverrideStyleTiny)).toEqual(Examples.tableOverrideStyleAdoc);
    });
    it('tableAdocBlockInCell', () => {
      expect(tinyHtmlToAdoc(Examples.tableAdocBlockInCellTiny)).toEqual(Examples.tableAdocBlockInCellAdoc);
    });
    it('tableColSpanAndRowSpan', () => {
      expect(tinyHtmlToAdoc(Examples.tableColSpanAndRowSpanTiny)).toEqual(Examples.tableColSpanAndRowSpanAdoc);
    });
    it('tableWidth', () => {
      expect(tinyHtmlToAdoc(Examples.tableWidthTiny)).toEqual(Examples.tableWidthAdoc);
    });
    it('tableCustomSeparator', () => {
      expect(tinyHtmlToAdoc(Examples.tableCustomSeparatorTiny)).toEqual(Examples.tableCustomSeparatorAdoc);
    });
    it('tableCsv', () => {
      expect(tinyHtmlToAdoc(Examples.tableCsvTiny)).toEqual(Examples.tableCsvAdoc);
    });
    it('tableEscapePipeChar', () => {
      expect(tinyHtmlToAdoc(Examples.tableEscapePipeCharTiny)).toEqual(Examples.tableEscapePipeCharAdoc);
    });
    it('stemBlock', () => {
      expect(tinyHtmlToAdoc(Examples.stemBlockTiny)).toEqual(Examples.stemBlockAdoc);
    });
    it('stemMixed', () => {
      expect(tinyHtmlToAdoc(Examples.stemMixedTiny)).toEqual(Examples.stemMixedAdoc);
    });
    it('openBlockSimple', () => {
      expect(tinyHtmlToAdoc(Examples.openBlockSimpleTiny)).toEqual(Examples.openBlockSimpleAdoc);
    });
    it('openBlockComplex', () => {
      expect(tinyHtmlToAdoc(Examples.openBlockComplexTiny)).toEqual(Examples.openBlockComplexAdoc);
    });
    it('includeSimple', () => {
      expect(tinyHtmlToAdoc(Examples.includeSimpleTiny)).toEqual(Examples.includeSimpleAdoc);
    });
    it('includeWithAttributes', () => {
      expect(tinyHtmlToAdoc(Examples.includeWithAttributesTiny)).toEqual(Examples.includeWithAttributesAdoc);
    });
    it('includeUnresolvedDirective', () => {
      expect(tinyHtmlToAdoc(Examples.includeUnresolvedDirectiveTiny)).toEqual(Examples.includeUnresolvedDirectiveAdoc);
    });
    it('conditionalDirective', () => {
      expect(tinyHtmlToAdoc(Examples.conditionalDirectiveTiny)).toEqual(Examples.conditionalDirectiveAdoc);
    });
    it('escapeSimple', () => {
      expect(tinyHtmlToAdoc(Examples.escapeSimpleTiny)).toEqual(Examples.escapeSimpleAdoc);
    });
    it('escapePlus', () => {
      expect(tinyHtmlToAdoc(Examples.escapePlusTiny)).toEqual(Examples.escapePlusAdoc);
    });
    it('escapeStarStar', () => {
      expect(tinyHtmlToAdoc(Examples.escapeStarStarTiny)).toEqual(Examples.escapeStarStarAdoc);
    });
    it('escapeDollarBrace', () => {
      expect(tinyHtmlToAdoc(Examples.escapeDollarBraceTiny)).toEqual(Examples.escapeDollarBraceAdoc);
    });
  });
  describe('inline', () => {
    it('textFormatSimple', () => {
      expect(tinyHtmlToAdoc(Examples.textFormatSimpleTiny)).toEqual(Examples.textFormatSimpleNormalized);
    });
    it('textFormatNested', () => {
      expect(tinyHtmlToAdoc(Examples.textFormatNestedTiny)).toEqual(Examples.textFormatNestedAdoc);
    });
    xit('textFormatLiteralMonospace', () => {
      // TODO: 深入了解下 `+{name}+` 语法与 `{name}` 的区别
      expect(tinyHtmlToAdoc(Examples.textFormatLiteralMonospaceTiny)).toEqual(Examples.textFormatLiteralMonospaceAdoc);
    });
    it('textFormatCustomSpan', () => {
      expect(tinyHtmlToAdoc(Examples.textFormatCustomSpanTiny)).toEqual(Examples.textFormatCustomSpanAdoc);
    });
    it('autoLinks', () => {
      expect(tinyHtmlToAdoc(Examples.autoLinksTiny)).toEqual(Examples.autoLinksAdoc);
    });
    it('enclosedLink', () => {
      expect(tinyHtmlToAdoc(Examples.enclosedLinkTiny)).toEqual(Examples.enclosedLinkAdoc);
    });
    it('autoLinkEscaped', () => {
      expect(tinyHtmlToAdoc(Examples.autoLinkEscapedTiny)).toEqual(Examples.autoLinkEscapedAdoc);
    });
    it('urlMacro', () => {
      expect(tinyHtmlToAdoc(Examples.urlMacroTiny)).toEqual(Examples.urlMacroAdoc);
    });
    xit('textInterpolation', () => {
      // TODO: 如何才能不展开变量
      expect(tinyHtmlToAdoc(Examples.textInterpolationTiny)).toEqual(Examples.textInterpolationAdoc);
    });
    it('crossReferenceBasic', () => {
      expect(tinyHtmlToAdoc(Examples.crossReferenceBasicTiny)).toEqual(Examples.crossReferenceBasicAdoc);
    });
    it('crossReferenceWithTitle', () => {
      expect(tinyHtmlToAdoc(Examples.crossReferenceWithTitleTiny)).toEqual(Examples.crossReferenceWithTitleAdoc);
    });
    it('crossReferenceNature', () => {
      expect(tinyHtmlToAdoc(Examples.crossReferenceNatureTiny)).toEqual(Examples.crossReferenceNatureAdoc);
    });
    it('crossReferenceToOtherDocument', () => {
      expect(tinyHtmlToAdoc(Examples.crossReferenceToOtherDocumentTiny)).toEqual(Examples.crossReferenceToOtherDocumentAdoc);
    });
    it('imageInline', () => {
      expect(tinyHtmlToAdoc(Examples.imageInlineTiny)).toEqual(Examples.imageInlineAdoc);
    });
    it('icon', () => {
      expect(tinyHtmlToAdoc(Examples.iconTiny)).toEqual(Examples.iconAdoc);
    });
    it('keyboardMacro', () => {
      expect(tinyHtmlToAdoc(Examples.keyboardMacroTiny)).toEqual(Examples.keyboardMacroAdoc);
    });
    it('buttonMacro', () => {
      expect(tinyHtmlToAdoc(Examples.buttonMacroTiny)).toEqual(Examples.buttonMacroAdoc);
    });
    it('menuMacro', () => {
      expect(tinyHtmlToAdoc(Examples.menuMacroTiny)).toEqual(Examples.menuMacroAdoc);
    });
    it('stemInline', () => {
      expect(tinyHtmlToAdoc(Examples.stemInlineTiny)).toEqual(Examples.stemInlineAdoc);
    });
  });
});
