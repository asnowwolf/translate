import { Exporter } from './exporter';
import { HtmlExporter, HtmlExporterOptions } from './html-exporter';
import { defaultSelectors, DomElement } from '../dom/parse5/dom-models';
import { markdown } from '../dom/unified/markdown';

function purgeHtml(result: string): string {
  return result
    .replace(/<div class="github-links">.*?<\/div>/gs, '')
    .replace(/<div class="breadcrumb-container">.*?code<\/i><\/a>\s+<\/div>\s+<\/div>/gs, '')
    .replace(/<!--.*?-->/gs, '')
    .replace(/<(div|header)[^>]*>/gs, '')
    .replace(/<\/\s*(div|header)>/gs, '')
    .replace(/<a title=.*?><i class="material-icons">link<\/i><\/a>/g, '')
    .trim();
}

export class AngularJsonExporter extends Exporter {
  private htmlExporter: HtmlExporter;

  constructor(selectors: ((node: DomElement) => boolean)[] = defaultSelectors) {
    super();
    this.htmlExporter = new HtmlExporter(selectors);
  }

  exportContent(content: string, options: HtmlExporterOptions): string | undefined {
    const json = JSON.parse(content);
    if (!json.contents) {
      return;
    }

    const result = this.htmlExporter.exportContent(this.preprocessAngularJson(json.contents), { ...options, format: 'html' });
    switch (options.format) {
      case 'auto':
        json.contents = result;
        return JSON.stringify(json);
      case 'html':
        return purgeHtml(result);
      case 'markdown':
        return markdown.mdFromHtml(purgeHtml(result)).replace(/\n\n+/g, '\n\n');
    }
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
