import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';

export const command = `extract <sourceGlobs...>`;

export const describe = '从对照翻译文件中提取出词典';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  dict: {
    required: true,
    description: '结果要输出到的文件，不用带扩展名',
  },
};

interface ExtractParams {
  sourceGlobs: string[];
  dict: string;
}

export const handler = async function (params: ExtractParams) {
  const filenames = globby(params.sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  // TODO: 把核心文本内容提取到独立的 markdown 格式的词典里
};
