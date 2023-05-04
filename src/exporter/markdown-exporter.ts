import { Exporter } from './exporter';
import { Blockquote, Code, Parent, Text } from 'mdast';
import * as unistVisit from 'unist-util-visit';
import { markdown } from '../dom/unified/markdown';
import { Node } from 'unist';
import { containsChinese } from '../dom/common';
import { ExportOptions } from './common';

interface MarkdownExporterOptions extends ExportOptions {
  mono: boolean;
}

export class MarkdownExporter extends Exporter {
  exportContent(content: string, options: MarkdownExporterOptions): string {
    const dom = markdown.parse(content);
    unistVisit(dom, 'text', (node: Text) => {
      node.value = node.value.replace(/\n/g, ' ');
    });
    if (options.mono) {
      this.removeOriginals(dom as Parent);
    }
    return markdown.stringify(dom);
  }

  private removeOriginals(dom: Parent): Parent {
    // 从翻译对中移除原文
    dom.children = dom.children.filter((node: Node, index: number) => {
      const next = dom.children[index + 1];
      // 如果是段落、标题、表行，要判断是否包含
      switch (node.type) {
        case 'paragraph':
        case 'heading':
        case 'tableRow':
          // 如果是最后一个，一定包含
          if (!next) {
            return true;
          }
          // 翻译对一定是成对出现的，如果类型不一样，就一定不是翻译对
          if (node.type !== next.type) {
            return true;
          }
          // 如果本段是中文或下段不是中文，则保留本段
          const text = markdown.stringify({ ...node, type: 'root' });
          const nextText = markdown.stringify({ ...next, type: 'root' });
          return containsChinese(text) || !containsChinese(nextText);
        case 'blockquote':
        case 'table':
        case 'list':
        case 'listItem':
          // 这几个类型递归处理
          this.removeOriginals(node as Blockquote);
          return true;
        case 'code':
          // 所有连续的两行代码，如果在注释前的内容都完全一样，并且第一行注释不包含中文，而第二行注释包含中文，则保留第二行
          const code = node as Code;
          switch (code.lang) {
            case 'console':
            case 'text':
              return true;
            case 'html':
            case 'xml':
            case 'svg':
              code.value = code.value.replace(/^(.*)<!--(?!.*\p{sc=Han}).*-->\n(\1<!--(?=.*\p{sc=Han}).*-->)$/gum, '$2');
              return true;
            case 'toml':
            case 'shell':
            case 'sh':
            case 'bash':
            case 'python':
            case 'ruby':
            case 'perl':
            case 'php':
              code.value = code.value.replace(/^(.*)#(?!.*\p{sc=Han}).*\n(\1#(?=.*\p{sc=Han}).*)$/gum, '$2');
              return true;
            default:
              code.value = code.value.replace(/^(.*)\/\/(?!.*\p{sc=Han}).*\n(\1\/\/(?=.*\p{sc=Han}).*)$/gum, '$2');
              return true;
          }
        default:
          // 否则，一定包含
          return true;
      }
    });
    return dom;
  }
}
