import { Exporter } from './exporter';
import { MAX_VISUAL_LENGTH, splitSubtitles } from '../translator/subtitle-translator';

interface SubtitleExporterOptions {
  maxVisualLength: number;
  mono: boolean;
}

export class SubtitleExporter extends Exporter {
  override getTargetFileName(filename: string) {
    return filename.replace(/.en\.(\w+)$/, '.cn.$1');
  }

  // 不支持对照显示，mono 永远为 true
  exportContent(content: string, options: SubtitleExporterOptions = { maxVisualLength: MAX_VISUAL_LENGTH, mono: true }): string {
    return splitSubtitles(content);
  }
}
