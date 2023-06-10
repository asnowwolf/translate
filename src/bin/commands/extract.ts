import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { getExtractorFor } from '../../extractor/get-extractor-for';
import { getDict } from '../../dict/get-dict';
import { relative } from 'path';

export const command = `extract <sourceGlobs...>`;

export const describe = '从发布版本的对照翻译文件中提取出词典';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  dict: {
    required: true,
    description: '结果要输出到的字典，会输出为 markdown 格式',
  },
};

interface ExtractParams {
  sourceGlobs: string[];
  cwd?: string;
  dict: string;
}

export const handler = async function (params: ExtractParams) {
  const filenames = globby(params.sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  const dict = getDict();
  try {
    for (let filename of filenames) {
      await dict.open(params.dict);
      const entries = getExtractorFor(filename).extract(filename);
      for (let entry of entries) {
        const tableName = relative(params.cwd, filename);
        await dict.save(tableName, entry);
      }
      dict.close();
    }
  } finally {
    await dict.close();
  }
};
