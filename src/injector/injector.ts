import { readFileSync, writeFileSync } from 'fs';
import { DomDocument, DomElement } from '../utils/tiny-dom/dom-models';

export class Injector {
  constructor(
    private styleUrls: string[],
    private scriptUrls: string[],
    private urlMap: Record<string, string>,
    private textMap: Record<string, string>,
  ) {
  }

  injectFile(filename: string): void {
    const content = readFileSync(filename, 'utf8');
    const result = this.inject(content);
    writeFileSync(filename, result, 'utf8');
  }

  inject(content: string): string {
    const doc = DomDocument.parse(content);
    // 对于文档片段，不需要注入
    if (doc.isFragment()) {
      return content;
    }
    this.injectTranslationKitToDoc(doc);
    return replaceText(doc.toHtml(), this.textMap);
  }

  injectTranslationKitToDoc(doc: DomDocument): void {
    this.injectTranslators(doc);
    this.replaceResourceUrls(doc);
  }

  injectTranslators(doc: DomDocument): void {
    this.styleUrls.forEach(styleUrl => {
      if (styleSheetExists(styleSheetsOf(doc), styleUrl)) {
        return;
      }
      const link = new DomElement('link', [{ name: 'href', value: styleUrl }, { name: 'rel', value: 'stylesheet' }]);
      doc.head.appendChild(link);
    });
    this.scriptUrls.forEach(scriptUrl => {
      if (scriptExists(scriptsOf(doc), scriptUrl)) {
        return;
      }
      const script = new DomElement('script', [{ name: 'src', value: scriptUrl }]);
      doc.body.appendChild(script);
    });
  }

  replaceResourceUrls(doc: DomDocument): void {
    styleSheetsOf(doc).forEach(styleSheet => {
      const newValue = this.urlMap[styleSheet.getAttribute('href')];
      if (newValue) {
        styleSheet.setAttribute('href', newValue);
      }
    });
    scriptsOf(doc).forEach(script => {
      const newValue = this.urlMap[script.getAttribute('src')];
      if (newValue) {
        script.setAttribute('src', newValue);
      }
    });
    doc.querySelectorAll<DomElement>(it => it.isTagOf('img') && it.hasAttribute('src')).forEach(image => {
      const newValue = this.urlMap[image.getAttribute('src')];
      if (newValue) {
        image.setAttribute('src', newValue);
      }
    });
  }

}

function replaceText(text: string, textMap: Record<string, string>): string {
  Object.entries(textMap).forEach(([key, value]) => {
    text = text.replace(new RegExp(key, 'gi'), value);
  });
  return text;
}

function styleSheetExists(styleSheets: DomElement[], styleSheetUrl: string): boolean {
  for (let i = 0; i < styleSheets.length; ++i) {
    if (styleSheets[i].getAttribute('href') === styleSheetUrl) {
      return true;
    }
  }
  return false;
}

function scriptExists(scripts: DomElement[], scriptUrl: string): boolean {
  for (let i = 0; i < scripts.length; ++i) {
    if (scripts[i].getAttribute('src') === scriptUrl) {
      return true;
    }
  }
  return false;
}

function styleSheetsOf(doc: DomDocument): DomElement[] {
  return doc.querySelectorAll<DomElement>(it => it.isTagOf('link') && it.getAttribute('rel') === 'stylesheet');
}

function scriptsOf(doc: DomDocument): DomElement[] {
  return doc.querySelectorAll<DomElement>(it => it.isTagOf('script') && it.hasAttribute('src'));
}
