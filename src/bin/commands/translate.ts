import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { TranslationEngineType } from '../../common';
import * as toVFile from 'to-vfile';
import { listFiles } from '../../file-utils';

export const command = `translate <sourceGlob>`;

export const describe = '自动翻译 sourceGlob 中的文件，支持 html 和 markdown 两种格式';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  engine: {
    type: 'string',
    choices: [
      TranslationEngineType.google,
      TranslationEngineType.gcloud,
      TranslationEngineType.ms,
      TranslationEngineType.dict,
      TranslationEngineType.fake,
    ],
    default: TranslationEngineType.google,
  },
  dict: {
    type: 'string',
    description: '当使用 dict 引擎时，指定要使用的字典目录。字典目录与被翻译目标同构，每个字典文件为一个 markdown 文件',
  },
};

interface Params {
  sourceGlob: string;
  engine: TranslationEngineType;
  dict: string;
}

export const handler = async function ({ sourceGlob, engine, dict }: Params) {
  const kit = new TranslationKit(engine, { dict });
  const files = listFiles(sourceGlob);
  const translatedFiles = await kit.translateFiles(files);
  translatedFiles.forEach(file => toVFile.writeSync(file));
};
