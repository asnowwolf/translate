import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { Marker } from '../../marker/marker';

export const command = `mark <sourceGlobs...>`;

export const describe = '为双语 HTML 文件做后期处理，根据语种加上翻译标记';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
};

interface Params {
  sourceGlobs: string[];
}

export const handler = function ({ sourceGlobs }: Params) {
  const filenames = sourceGlobs.map(it => globby(it)).flat();
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  for (const filename of filenames) {
    console.log('marking: ', filename);
    const marker = new Marker();
    marker.markFile(filename);
  }
};
