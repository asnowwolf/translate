import { mergeTimelineBySentence, splitTimelineBySentence, SubtitleTranslator } from './subtitle-translator';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { readFileSync } from 'fs';
import { subtitle } from '../dom/subtitle/subtitle';

describe('subtitle-translator', () => {
  it('translate vtt file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new SubtitleTranslator(engine);
    const original = readFileSync('samples/subtitle/demo.vtt', 'utf8');
    const translation = await translator.translateContentAndFlushStandalone(original, {});
    expect(translation).toEqual(readFileSync('samples/subtitle/demo-translated.vtt', 'utf8').trim());
  });

  it('translate srt file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new SubtitleTranslator(engine);
    const original = readFileSync('samples/subtitle/demo.srt', 'utf8');
    const translation = await translator.translateContentAndFlushStandalone(original, {});
    expect(translation).toEqual(readFileSync('samples/subtitle/demo-translated.srt', 'utf8').trim());
  });

  it('translate translated srt file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new SubtitleTranslator(engine);
    const original = readFileSync('samples/subtitle/demo-translated.srt', 'utf8');
    const translation = await translator.translateContentAndFlushStandalone(original, {});
    expect(translation).toEqual(readFileSync('samples/subtitle/demo-translated.srt', 'utf8').trim());
  });

  it('should merge timeline by sentence', function () {
    const vtt = subtitle.parse(`WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:00:01.390
MINKO GECHEV: Hello, everyone,

00:00:01.390 --> 00:00:02.670
My name is Minko Gechev.

00:00:02.670 --> 00:00:05.490
I'm working on
Angular at Google.`);
    const wholeSentences = mergeTimelineBySentence(vtt.items);
    expect(wholeSentences).toEqual([
      {
        'endTime': 2670,
        'items': [
          {
            'cue': '',
            'endTime': 1390,
            'startTime': 0,
            'text': 'MINKO GECHEV: Hello, everyone,',
          },
          {
            'cue': '',
            'endTime': 2670,
            'startTime': 1390,
            'text': 'My name is Minko Gechev.',
          },
        ],
        'original': 'MINKO GECHEV: Hello, everyone, My name is Minko Gechev.',
        'startTime': 0,
        'translation': '',
      },
      {
        'endTime': 5490,
        'items': [
          {
            'cue': '',
            'endTime': 5490,
            'startTime': 2670,
            'text': 'I\'m working on\nAngular at Google.',
          },
        ],
        'original': 'I\'m working on Angular at Google.',
        'startTime': 2670,
        'translation': '',
      },
    ]);
  });

  it('should split timeline by sentence', function () {
    const wholeSentences = [
      {
        'endTime': 2670,
        'items': [
          {
            'cue': '',
            'endTime': 1390,
            'startTime': 0,
            'text': 'MINKO GECHEV: Hello, everyone,',
          },
          {
            'cue': '',
            'endTime': 2670,
            'startTime': 1390,
            'text': 'My name is Minko Gechev.',
          },
        ],
        'original': 'MINKO GECHEV: Hello, everyone, My name is Minko Gechev.',
        'translation': 'MINKO GECHEV: 大家好！我是 Minko Gechev。',
        'startTime': 0,
      },
      {
        'endTime': 5490,
        'items': [
          {
            'cue': '',
            'endTime': 5490,
            'startTime': 2670,
            'text': 'I\'m working on\nAngular at Google.',
          },
        ],
        'original': 'I\'m working on\nAngular at Google.',
        'startTime': 2670,
        'translation': '我在 Google 做 Angular。',
      },
    ];
    const items = splitTimelineBySentence(wholeSentences);
    expect(items).toEqual([
      {
        'cue': '',
        'endTime': 1438,
        'startTime': 0,
        'text': 'MINKO GECHEV: 大家好！',
      },
      {
        'cue': '',
        'endTime': 2670,
        'startTime': 1438,
        'text': '我是 Minko Gechev。',
      },
      {
        'cue': '',
        'endTime': 5490,
        'startTime': 2670,
        'text': '我在 Google 做 Angular。',
      },
    ]);
  });
  it('should split timeline by sentence with lesser maxVisualLength', function () {
    const wholeSentences = [
      {
        'endTime': 2670,
        'items': [
          {
            'cue': '',
            'endTime': 1390,
            'startTime': 0,
            'text': 'MINKO GECHEV: Hello, everyone,',
          },
          {
            'cue': '',
            'endTime': 2670,
            'startTime': 1390,
            'text': 'My name is Minko Gechev.',
          },
        ],
        'original': 'MINKO GECHEV: Hello, everyone, My name is Minko Gechev.',
        'translation': 'MINKO GECHEV: 大家好！我是 Minko Gechev。',
        'startTime': 0,
      },
      {
        'endTime': 5490,
        'items': [
          {
            'cue': '',
            'endTime': 5490,
            'startTime': 2670,
            'text': 'I\'m working on\nAngular at Google.',
          },
        ],
        'original': 'I\'m working on\nAngular at Google.',
        'startTime': 2670,
        'translation': '我在 Google 做 Angular。',
      },
    ];
    const items = splitTimelineBySentence(wholeSentences, 10);
    expect(items).toEqual([
      {
        'cue': '',
        'endTime': 1506,
        'startTime': 0,
        'text': 'MINKO GECHEV: \n大家好！',
      },
      {
        'cue': '',
        'endTime': 2738,
        'startTime': 1506,
        'text': '我是 Minko Gechev。',
      },
      {
        'cue': '',
        'endTime': 5613,
        'startTime': 2670,
        'text': '我在 Google \n做 Angular。',
      },
    ]);
  });
});
