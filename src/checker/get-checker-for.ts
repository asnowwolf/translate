import { extname } from 'path';
import { markdown } from '../dom/unified/markdown';
import { readFileSync } from 'fs';

interface CheckResult {
  filename: string;
  original: string;
  translation: string;
  tokens: string[];
}

interface Checker {
  checkFile(filename: string): Promise<CheckResult[]>;
}

class MarkdownChecker implements Checker {
  checkFile(filename: string): Promise<CheckResult[]> {
    const ast = markdown.parse(readFileSync(filename, 'utf8'));
    const result: CheckResult[] = [];
    return markdown.visit(ast, undefined, (original, translation) => {
      if (original && translation) {
        if (original.length < translation.length) {
          result.push({
            filename,
            original,
            translation,
            tokens: ['length'],
          });
        } else {
          const englishTokens = Array.from(translation.replace(/\bangular\.cn/g, 'angular.io').matchAll(/\w+/g))
            .map(it => it[0].toLowerCase());
          const tokens = englishTokens.filter(token => !original.toLowerCase().includes(token));

          if (tokens.length > 0) {
            result.push({
              filename,
              original,
              translation,
              tokens,
            });
          }
        }
      }
      return Promise.resolve(undefined);
    }).then(() => result);
  }
}

export function getCheckerFor(filename: string): Checker {
  const ext = extname(filename);
  switch (ext) {
    case '.markdown':
    case '.md':
      return new MarkdownChecker();
  }
  throw new Error(`不支持的文件扩展名：${ext}`);
}
