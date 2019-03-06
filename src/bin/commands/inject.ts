import { CommandBuilder } from 'yargs';
import { injectTranslationKit } from '../../translation-kit';
import * as toVFile from 'to-vfile';
import { tap } from 'rxjs/operators';
import { readFileSync } from 'fs';

export const command = `inject <sourceGlob>`;

export const describe = '为双语 HTML 文件做后期处理，注入翻译工具';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  styleUrls: {
    array: true,
    alias: 'c',
    description: '要注入的 css 文件，可传多个',
  },
  scriptUrls: {
    array: true,
    alias: 's',
    description: '要注入的 javascript 文件，可传多个',
  },
  urlMap: {
    string: true,
    alias: 'm',
    coerce: (filename: string) => {
      return JSON.parse(readFileSync(filename, 'utf-8'));
    },
    description: '供替换的 url 映射，指向一个 JSON 格式的配置文件，其内容形如：{"old": "new"}',
  },
};

interface Params {
  sourceGlob: string;
  styleUrls: string[];
  scriptUrls: string[];
  urlMap: Record<string, string>;
}

export const handler = function ({ sourceGlob, styleUrls, scriptUrls, urlMap }: Params) {
  return injectTranslationKit(sourceGlob, styleUrls, scriptUrls, urlMap).pipe(
    tap(file => toVFile.writeSync(file)),
  ).subscribe((file) => {
    console.log(`injected: ${file.path}!`);
  }, (error) => {
    console.error(error);
    process.exit(-1);
  }, () => {
    console.log('Done!');
    process.exit(0);
  });
};
