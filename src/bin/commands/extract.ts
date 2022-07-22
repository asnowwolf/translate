import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { SqliteDict } from '../../dict/sqlite-dict';
import { getExtractorFor } from '../../extractor/get-extractor-for';
import { groupBy, uniqBy } from 'lodash';
import { generateFingerprint } from '../../dict/generate-fingerprint';

export const command = `extract <outFile> <sourceGlobs...>`;

export const describe = '提取翻译对';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  outFile: {
    description: '结果输出到的文件，不用带扩展名',
  },
};

interface ExtractParams {
  sourceGlobs: string[];
  outFile: string;
}

export const handler = async function ({ sourceGlobs, outFile }: ExtractParams) {
  const filenames = globby(sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  const dict = new SqliteDict();
  await dict.open(outFile);
  try {
    const allPairs = await Promise.all(filenames.map(filename => getExtractorFor(filename).extract(filename)));
    const uniqPairs = uniqBy(allPairs.flat(), (it) =>
      generateFingerprint(it.english, it.format) + generateFingerprint(it.chinese, it.format),
    );
    const groups = groupBy(uniqPairs, it => it.path);
    for (const [file, pairs] of Object.entries(groups)) {
      for (const pair of pairs) {
        await dict.createOrUpdate(pair.english, pair.chinese, pair.format, { path: file });
      }
    }
  } finally {
    await dict.close();
  }
};
