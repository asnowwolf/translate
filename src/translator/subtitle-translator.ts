import { AbstractTranslator } from './abstract-translator';
import { TranslationOptions } from './translation-options';
import { subtitle } from '../dom/subtitle/subtitle';
import { containsChinese } from '../dom/common';
import Subtitle = subtitle.Subtitle;
import SubtitleItem = subtitle.SubtitleItem;

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
      doc.items = wholeSentences.map((wholeSentence) => {
        return {
          cue: '',
          startTime: wholeSentence.startTime,
          endTime: wholeSentence.endTime,
          text: mergeWholeSentence(wholeSentence),
        };
      });
      doc.meta.language = 'zh-Hans';
    });
    return doc;
  }

  translateWholeSentences(wholeSentences: WholeSentence[]): Promise<WholeSentence[]> {
    return Promise.all(wholeSentences.map((wholeSentence) => {
      return this.translateSentence(wholeSentence.original.replace(/(\r?\n|\xa0)/g, ' '), 'plain').then((translation) => {
        wholeSentence.translation = translation;
      });
    })).then(() => wholeSentences);
  }

}

interface WholeSentence {
  original: string;
  translation: string;
  startTime: number;
  endTime: number;
  items: SubtitleItem[];
}

function mergeWholeSentence(wholeSentence: WholeSentence) {
  if (wholeSentence.original.trim() === wholeSentence.translation.trim()) {
    return wholeSentence.original;
  } else {
    return `${wholeSentence.original.replace(/\r?\n/g, ' ')}\n${wholeSentence.translation}`;
  }
}

export function mergeTimelineBySentence(items: SubtitleItem[]): WholeSentence[] {
  const wholeSentences: WholeSentence[] = [];
  // 根据句号等标点合并文本，同时合并时间轴
  let text = '';
  let startTime = items[0].startTime ?? 0;
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
  const fragments = translation.split(/(?<=[，。！？；])/);
  const result: string[] = [];
  let text = '';

  // 给定字符处是否可以断开
  function canBreakAt(char: string): boolean {
    return containsChinese(char);
  }

  function splitLongSentence(text: string): string[] {
    const result: string[] = [];
    let prevPos = 0;
    let i = 0;
    while (i <= text.length) {
      const currentText = text.slice(prevPos, i);
      if (visualLengthOf(currentText) > maxVisualLength && canBreakAt(text[i]) || i === text.length) {
        result.push(currentText);
        prevPos = i;
      }
      ++i;
    }
    return result;
  }

  for (let i = 0; i < fragments.length; i++) {
    text += fragments[i];
    const thisFragmentExceeded = visualLengthOf(text) > maxVisualLength;
    const nextFragmentExceeded = visualLengthOf(text + (fragments[i + 1] ?? '')) > maxVisualLength;
    const isLastFragment = i === fragments.length - 1;
    if (thisFragmentExceeded) {
      const subFragments = splitLongSentence(text);
      result.push(subFragments.join('\n'));
      text = '';
    } else if (nextFragmentExceeded || isLastFragment) {
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

export function splitSubtitles(content: string, maxVisualLength = MAX_VISUAL_LENGTH): string {
  const dom = subtitle.parse(content);
  const wholeSentences: WholeSentence[] = dom.items.map(it => {
    const [original, translation] = it.text.split(/\r?\n/);
    return ({
      startTime: it.startTime,
      endTime: it.endTime,
      cue: it.cue,
      original,
      translation,
      items: [],
    });
  });
  const items = wholeSentences.flatMap((wholeSentence) => splitTimeline(wholeSentence, maxVisualLength));
  return subtitle.stringify({ meta: dom.meta, items });
}
