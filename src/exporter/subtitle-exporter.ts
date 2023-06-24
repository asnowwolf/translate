import { Exporter } from './exporter';
import { splitSubtitles } from '../translator/subtitle-translator';
import { ExportOptions } from './common';

interface SubtitleExporterOptions extends ExportOptions {
  maxVisualLength: number;
  mono: boolean;
}

export class SubtitleExporter extends Exporter {
  override getTargetFileName(filename: string, options: ExportOptions) {
    return filename.replace(/.en\.(\w+)$/, '.cn.$1');
  }

  // 不支持对照显示，mono 永远为 true，只支持 auto 模式
  exportContent(content: string, options: SubtitleExporterOptions): string | undefined {
    if (options.format !== 'auto') {
      return;
    }
    return splitSubtitles(content);
  }
}
