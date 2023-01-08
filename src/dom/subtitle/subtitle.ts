export namespace subtitle {
  export enum SubtitleFormat {
    AUTO = 'auto',
    SRT = 'srt',
    VTT = 'vtt',
  }

  export interface Subtitle {
    meta: MetaInfo;
    items: SubtitleItem[];
  }

  export interface MetaInfo {
    header: string;
    format: SubtitleFormat;
    kind: string;
    language: string;
  }

  export interface SubtitleItem {
    cue: string;
    startTime: number;
    endTime: number;
    text: string;
  }

  export function parse(text: string, format: SubtitleFormat = SubtitleFormat.AUTO): Subtitle {
    if (format === SubtitleFormat.AUTO) {
      return parse(text, detectFormat(text));
    } else if (format === SubtitleFormat.SRT || format === SubtitleFormat.VTT) {
      const { meta, items } = partition(text, format);
      return {
        meta,
        items: items.map((segment) => {
          const lines = segment.split(/\r?\n/);
          const timeIndex = lines.findIndex((line) => /\d\d:\d\d:\d\d[,.]\d\d\d --> \d\d:\d\d:\d\d[,.]\d\d\d/.test(line));
          const time = lines[timeIndex].split(' --> ');
          return {
            cue: lines[timeIndex - 1] ?? '',
            startTime: parseTime(time[0]),
            endTime: parseTime(time[1]),
            text: unescapeSubtitle(lines.slice(timeIndex + 1).join('\n').trim(), format),
          };
        }),
      };
    }
  }

  export function stringify(subtitle: Subtitle, format: SubtitleFormat = SubtitleFormat.AUTO): string {
    if (format === SubtitleFormat.AUTO) {
      return stringify(subtitle, subtitle.meta.format);
    } else if (format === SubtitleFormat.SRT) {
      return subtitle.items.map((item, index) => {
        return `${index + 1}
${formatTime(item.startTime, format)} --> ${formatTime(item.endTime, format)}
${escapeSubtitle(item.text, format)}`;
      }).join('\n\n');
    } else if (format === SubtitleFormat.VTT) {
      const meta = `${['WEBVTT', escapeSubtitle(subtitle.meta.header, SubtitleFormat.VTT)].filter(it => !!it).join(' - ')}
Kind: ${subtitle.meta.kind}
Language: ${subtitle.meta.language}`;
      const body = subtitle.items.map((item, index) => {
        return `${escapeSubtitle(item.cue ?? '', format)}
${formatTime(item.startTime, format)} --> ${formatTime(item.endTime, format)}
${escapeSubtitle(item.text, format)}`.trim();
      });
      return [meta, ...body].join('\n\n');
    }
  }

  function detectFormat(text: string): SubtitleFormat {
    if (text.startsWith('WEBVTT')) {
      return SubtitleFormat.VTT;
    } else if (/\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d/.test(text)) {
      return SubtitleFormat.SRT;
    } else {
      throw new Error('Unsupported subtitle format');
    }
  }

  function parseVttMeta(text: string): MetaInfo {
    const lines = text.split('\n');
    const header = lines[0];
    const kind = lines[1].split(':')[1].trim();
    const language = lines[2].split(':')[1].trim();
    return {
      header: unescapeSubtitle(header.split('-')[1]?.trim() ?? '', SubtitleFormat.VTT),
      format: SubtitleFormat.VTT,
      kind,
      language,
    };
  }

  function partition(text: string, format: SubtitleFormat): { meta: MetaInfo, items: string[] } {
    const segments = text.split(/\r?\n\r?\n/).filter(it => !!it);
    if (format === SubtitleFormat.SRT) {
      return {
        meta: {
          header: '',
          format: SubtitleFormat.SRT,
          kind: 'captions',
          language: 'en',
        },
        items: segments,
      };
    } else if (format === SubtitleFormat.VTT) {
      return {
        meta: parseVttMeta(segments[0]),
        items: segments.slice(1),
      };
    }
  }

  function parseTime(string: string): number {
    const [hours, minutes, seconds, milliseconds] = string.split(/[:,.]/).map((s) => parseInt(s, 10));
    return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
  }

  function escapeSubtitle(text: string, format: SubtitleFormat.SRT | SubtitleFormat.VTT): string {
    if (format === SubtitleFormat.SRT) {
      return text.replace(/\xa0/g, '\\h');
    } else if (format === SubtitleFormat.VTT) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\xa0/g, '&nbsp;')
        ;
    }
  }

  function unescapeSubtitle(text: string, format: SubtitleFormat.SRT | SubtitleFormat.VTT): string {
    if (format === SubtitleFormat.SRT) {
      return text.replace(/\\h/g, '\xa0').replace(/\\N/g, '\n');
    } else if (format === SubtitleFormat.VTT) {
      return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, '\xa0')
        .replace(/&amp;/g, '&');
    }
  }

  function pad(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }

  function formatTime(time: number, format: SubtitleFormat): string {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time - hours * 3600000) / 60000);
    const seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
    const milliseconds = time - hours * 3600000 - minutes * 60000 - seconds * 1000;
    if (format === SubtitleFormat.SRT) {
      return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(milliseconds, 3)}`;
    } else if (format === SubtitleFormat.VTT) {
      return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
    }
  }
}
