import { CommandBuilder } from 'yargs';
import { Dict } from '../../dict/dict';
import { groupBy, uniqBy } from 'lodash';
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
  const regExp = new RegExp(filter, 'i');
  const files = globby(sourceGlob);
  const extractor = new Extractor();
  const allPairs = files.map(file => extractor.extractFile(file)).flat()
    .filter(it => regExp.test(it.english) || regExp.test(it.chinese));
  const pairs = uniqBy(allPairs, (it) => it.english + it.chinese);
  const groups = groupBy(pairs, it => it.file);
  const dict = new Dict();
  await dict.open(outFile);
  try {
    for (const [file, pairs] of Object.entries(groups)) {
      for (const pair of pairs) {
        await dict.createOrUpdate(file, pair.english, pair.chinese, pair.xpath);
      }
    }
  } finally {
    await dict.close();
  }
};
