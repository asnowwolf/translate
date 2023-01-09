import { Marker } from './marker';
import { HtmlMarker } from './html-marker';
import { defaultSelectors, DomElement } from '../dom/parse5/dom-models';

export class AngularJsonMarker extends Marker {
  private htmlMarker: HtmlMarker;

  constructor(selectors: ((node: DomElement) => boolean)[] = defaultSelectors) {
    super();
    this.htmlMarker = new HtmlMarker(selectors);
  }

  markContent(content: string, mono: boolean) {
    const json = JSON.parse(content);
    if (!json.contents) {
      return content;
    }

    json.contents = this.htmlMarker.markContent(this.preprocessAngularJson(json.contents), mono);
    return JSON.stringify(json);
  }

  private preprocessAngularJson(contents: string): string {
    // 对 cheatsheet页做特殊处理
    if (contents.includes('<h1 class="no-toc">Cheat Sheet</h1>')) {
      return contents.replace(/<(td|th)>\s*<p>([\s\S]*?)<\/p>\s*<\/\1>/g, '<$1>$2</$1>');
    }
    // 为其它页面中的 section、header 添加翻译标记
    return contents.replace(/<(section|header)\b/g, '<$1 ng-should-translate');
  }
}
