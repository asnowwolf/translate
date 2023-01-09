import { Marker } from './marker';
import { splitSubtitles } from '../translator/subtitle-translator';

export class SubtitleMarker extends Marker {
  // 不支持对照显示，mono 永远为 true
  markContent(content: string, mono = true): string {
    return splitSubtitles(content);
  }
}
