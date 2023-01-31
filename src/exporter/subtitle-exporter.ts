import { Exporter } from './exporter';
import { splitSubtitles } from '../translator/subtitle-translator';

export class SubtitleExporter extends Exporter {
  override getTargetFileName(filename: string) {
    return filename.replace(/.en\.(\w+)$/, '.cn.$1');
  }

  // 不支持对照显示，mono 永远为 true
  exportContent(content: string, mono = true): string {
    return splitSubtitles(content);
  }
}
