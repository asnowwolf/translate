import { CommandBuilder } from 'yargs';
import { Dict } from '../../dict/dict';
import { sync as globby } from 'globby';
import { Extractor } from '../../extractor/extractor';

export const command = `extract <sourceGlob> [outFile]`;

export const describe = '提取翻译对';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  outFile: {
    description: '结果输出到的文件，不要带扩展名',
    default: 'STDOUT',
  },
  filter: {
    type: 'string',
    default: '.*',
    description: '过滤器的正则表达式',
  },
};

interface ExtractParams {
  sourceGlob: string;
  outFile: string;
  filter: string;
}

export const handler = async function ({ sourceGlob, outFile, filter }: ExtractParams) {
  const files = globby(sourceGlob);
  const dict = new Dict();
  await dict.open(outFile);
  const extractor = new Extractor();
  await extractor.extractFilesToDict(files, dict, new RegExp(filter, 'i'));
};
