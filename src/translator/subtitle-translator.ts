import { AbstractTranslator } from './abstract-translator';
import { TranslationOptions } from './translation-options';
import { subtitle } from '../dom/subtitle/subtitle';
import { containsChinese } from '../dom/common';
import Subtitle = subtitle.Subtitle;
import SubtitleItem = subtitle.SubtitleItem;

interface WholeSentence {
  original: string;
  translation: string;
  startTime: number;
  endTime: number;
  items: SubtitleItem[];
}

export class SubtitleTranslator extends AbstractTranslator<object> {
  parse(text: string): Subtitle {
    return subtitle.parse(text);
  }

  serialize(doc: Subtitle): string {
    return subtitle.stringify(doc);
  }

  translateDoc(doc: Subtitle, options: TranslationOptions) {
    // 建立文本到时间轴的映射
    const wholeSentences = mergeTimelineBySentence(doc.items);
    // 翻译文本
    this.translateWholeSentences(wholeSentences).then((wholeSentences) => {
      // 将翻译结果映射回时间轴，并根据标点进行适当的拆分
      doc.items = splitTimelineBySentence(wholeSentences);
      doc.meta.language = 'zh-Hans';
    });
    return doc;
  }

  translateWholeSentences(wholeSentences: WholeSentence[]): Promise<WholeSentence[]> {
    return Promise.all(wholeSentences.map((wholeSentence) => {
      return this.translateSentence(wholeSentence.original, 'markdown').then((translation) => {
        wholeSentence.translation = translation;
      });
    })).then(() => wholeSentences);
  }

}

export function mergeTimelineBySentence(items: SubtitleItem[]): WholeSentence[] {
  const wholeSentences: WholeSentence[] = [];
  // 根据句号等标点合并文本，同时合并时间轴
  let text = '';
  let startTime = 0;
  let originalItems: SubtitleItem[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    originalItems.push(item);
    text += item.text + ' ';
    if (/[.!]$/.test(item.text) || i === items.length - 1) {
      wholeSentences.push({ original: text.trim(), translation: '', startTime, endTime: item.endTime, items: originalItems });
      text = '';
      startTime = item.endTime;
      originalItems = [];
    }
  }
  return wholeSentences;
}

// 求字符串的视觉长度，中文算两个字符，英文算一个字符
function visualLengthOf(text: string): number {
  return text.split('').map(it => containsChinese(it) ? 2 : 1).reduce((a, b) => a + b, 0);
}

function splitChineseSentence(translation: string, maxVisualLength: number): string[] {
  const fragments = translation.split(/(?<=[ ，。！？；])/);
  const result: string[] = [];
  let text = '';
  for (let i = 0; i < fragments.length; i++) {
    text += fragments[i];
    if (visualLengthOf(text) > maxVisualLength || i === fragments.length - 1) {
      result.push(text.trim());
      text = '';
    }
  }
  return result;
}

function splitTimeline(wholeSentence: WholeSentence, maxVisualLength: number): SubtitleItem[] {
  const result: SubtitleItem[] = [];
  const fragments = splitChineseSentence(wholeSentence.translation, maxVisualLength);
  const unitDuration = (wholeSentence.endTime - wholeSentence.startTime) / visualLengthOf(wholeSentence.translation);
  let startTime = wholeSentence.startTime;
  for (let text of fragments) {
    // 按视觉长度估算本段文本的实际长度
    const currentDuration = Math.round(visualLengthOf(text) * unitDuration);
    result.push({
      startTime: startTime,
      endTime: startTime + currentDuration,
      text,
      cue: '',
    });
    startTime += currentDuration;
  }
  return result;
}

const MAX_VISUAL_LENGTH = 36;

export function splitTimelineBySentence(wholeSentences: WholeSentence[], maxVisualLength = MAX_VISUAL_LENGTH): SubtitleItem[] {
  return wholeSentences.flatMap((wholeSentence) => splitTimeline(wholeSentence, maxVisualLength));
}
