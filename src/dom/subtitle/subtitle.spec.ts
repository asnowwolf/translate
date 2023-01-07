import { subtitle } from './subtitle';
import SubtitleFormat = subtitle.SubtitleFormat;
import Subtitle = subtitle.Subtitle;

describe('subtitle dom', () => {
  const vttText = `WEBVTT - This is a comment
Kind: captions
Language: en

00:00:00.000 --> 00:00:01.390
MINKO GECHEV: Hello, &lt;everyone&gt;.

00:00:01.390 --> 00:00:02.670
My name is Minko Gechev.`;
  const vttDom: Subtitle = {
    meta: {
      format: 'vtt' as SubtitleFormat,
      header: 'This is a comment',
      kind: 'captions',
      language: 'en',
    },
    items: [
      {
        cue: '',
        startTime: 0,
        endTime: 1390,
        text: 'MINKO GECHEV: Hello, <everyone>.',
      },
      {
        cue: '',
        startTime: 1390,
        endTime: 2670,
        text: 'My name is Minko Gechev.',
      },
    ],
  };
  it('should parse vtt', function () {
    expect(subtitle.parse(vttText)).toEqual(vttDom);
  });
  it('should stringify vtt', function () {
    expect(subtitle.stringify(vttDom, SubtitleFormat.VTT)).toEqual(vttText);
  });
  const srtText = `1
00:00:00,000 --> 00:00:01,390
MINKO GECHEV: Hello, every\\hone.

2
00:00:01,390 --> 00:00:02,670
My name is Minko Gechev.`;
  const srtDom: Subtitle = {
    meta: {
      header: '',
      format: 'srt' as SubtitleFormat,
      kind: 'captions',
      language: 'en',
    },
    items: [
      {
        cue: '1',
        startTime: 0,
        endTime: 1390,
        text: 'MINKO GECHEV: Hello, every\xa0one.',
      },
      {
        cue: '2',
        startTime: 1390,
        endTime: 2670,
        text: 'My name is Minko Gechev.',
      },
    ],
  };
  it('should parse srt', function () {
    expect(subtitle.parse(srtText)).toEqual(srtDom);
  });
  it('should stringify srt', function () {
    expect(subtitle.stringify(srtDom, SubtitleFormat.SRT)).toEqual(srtText);
  });
});
