import { AbstractExtractor, SentencePair } from './extractor';
import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { Asciidoctor } from '@asciidoctor/core';
import { Adoc } from '../dom/asciidoctor/utils/adoc';
import { containsChinese } from '../dom/common';
import { isArray } from 'util';
import AbstractNode = Asciidoctor.AbstractNode;
import AbstractBlock = Asciidoctor.AbstractBlock;

export class AdocExtractor extends AbstractExtractor {
  private builder = new AdocBuilder();

  extractSentencePairsFromContent(text: string): SentencePair[] {
    const doc = this.builder.parse(text);
    return this.extractSentencePairsFromDom(doc);
  }

  private extractSentencePairsFromDom(node: AbstractNode): SentencePair[] {
    const result: SentencePair[] = [];
    const attrs = node.getAttributes();
    const originalKeys = Object.keys(attrs).filter(it => it.startsWith('original_'));
    const pairsFromSelf = originalKeys.map(englishName => {
      const chineseName = englishName.replace(/^original_/, '');
      return {
        english: attrs[englishName],
        chinese: attrs[chineseName] ?? node[chineseName],
        format: 'asciidoctor',
      };
    }) as SentencePair[];
    result.push(...pairsFromSelf);
    if (Adoc.isAbstractBlock(node)) {
      const blocks = node.getBlocks().flat(9) as AbstractBlock[];
      for (let i = 1; i < blocks.length; ++i) {
        const prev = blocks[i - 1];
        const current = blocks[i];
        if (!isArray(current) && !isArray(prev) && Adoc.isParagraph(current) && Adoc.isParagraph(prev)) {
          const prevText = this.builder.build(prev as any);
          const currentText = this.builder.build(current as any);
          if (containsChinese(currentText)) {
            result.push({
              english: prevText,
              chinese: currentText,
              format: 'asciidoctor',
            });
          }
        }
      }
      blocks.forEach(block => {
        result.push(...this.extractSentencePairsFromDom(block));
      });
    }
    if (Adoc.hasLines(node)) {
      const sentences = node.lines.join('\n').split('\n\n');
      for (let i = 1; i < sentences.length; ++i) {
        const current = sentences[i];
        const prev = sentences[i - 1];
        if (containsChinese(current)) {
          result.push({
            english: prev,
            chinese: current,
            format: 'asciidoctor',
          });
        }
      }
    }
    if (Adoc.isTable(node)) {
      const rows = node.getRows();
      [rows.head, rows.body, rows.foot].flat(9).map(it => it.text.split('\n\n'))
        .filter(([english, chinese]) => english && chinese && !containsChinese(english) && containsChinese(chinese))
        .forEach(([english, chinese]) => {
          result.push({
            english: english,
            chinese: chinese,
            format: 'asciidoctor',
          });
        });
    }
    if (Adoc.isListItem(node)) {
      const [english, chinese] = node.getText().toString().split('$$$');
      if (english && chinese && english !== chinese) {
        result.push({
          english: english,
          chinese: chinese,
          format: 'asciidoctor',
        });
      }
    }
    return result;
  }
}
