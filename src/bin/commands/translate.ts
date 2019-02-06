import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { TranslationEngineType } from '../../common';

export const command = `translate <sourceGlob> <outDir>`;

export const describe = '把 sourceGlob 中的内容自动翻译的 targetDir 中';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  outDir: {
    description: '输出目录',
  },
  engine: {
    type: 'string',
    choices: [TranslationEngineType.google, TranslationEngineType.ms],
    default: TranslationEngineType.google,
  },
};

interface Params {
  sourceGlob: string;
  outDir: string;
  engine: TranslationEngineType;
}

export const handler = function ({ sourceGlob, outDir, engine }: Params) {
  const kit = new TranslationKit(engine);
  return kit.translateFiles(sourceGlob).subscribe((vfile) => {
    console.log(vfile.contents);
  });
};
