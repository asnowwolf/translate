import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { getMarkerFor } from '../../marker/get-marker-for';

export const command = `mark <sourceGlobs...>`;

export const describe = '为双语 HTML 文件做后期处理，根据语种加上翻译标记';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  mono: {
    description: '结果中只包含中文，即只生成单一格式而非对照格式',
    type: 'boolean',
  },
};

interface Params {
  sourceGlobs: string[];
  mono: boolean;
}

export const handler = function ({ sourceGlobs, mono }: Params) {
  const filenames = globby(sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  for (const filename of filenames) {
    console.log('marking: ', filename);
    const marker = getMarkerFor(filename);
    marker.markFile(filename, mono);
  }
};
