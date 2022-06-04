import { CommandBuilder } from 'yargs';
import { readFileSync } from 'fs';
import { sync as globby } from 'globby';
import { Injector } from '../../injector/injector';

export const command = `inject <sourceGlobs...>`;

export const describe = '为双语 HTML 文件做后期处理，注入翻译工具';

export const builder: CommandBuilder = {
  sourceGlobs: {
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
    description: '供替换的 url 映射（脚本、css、图片），指向一个 JSON 格式的配置文件，其内容形如：{"old": "new"}',
  },
  textMap: {
    string: true,
    alias: 't',
    coerce: (filename: string) => {
      return JSON.parse(readFileSync(filename, 'utf-8'));
    },
    description: '供替换的文本映射，指向一个 JSON 格式的配置文件，其内容形如：{"oldRegExp": "new"}',
  },
};

interface Params {
  sourceGlobs: string[];
  styleUrls: string[];
  scriptUrls: string[];
  urlMap: Record<string, string>;
  textMap: Record<string, string>;
}

export const handler = function ({ sourceGlobs, styleUrls, scriptUrls, urlMap, textMap }: Params) {
  const filenames = globby(sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  const injector = new Injector(styleUrls, scriptUrls, urlMap, textMap);
  for (const filename of filenames) {
    injector.injectFile(filename);
    console.log(`injected: ${filename}!`);
  }
};
