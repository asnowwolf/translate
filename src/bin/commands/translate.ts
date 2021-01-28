import { CommandBuilder } from 'yargs';
import { TranslationEngineType } from '../../common';
import { getTranslationEngine } from '../../translation-engine/get-translation-engine';
import { getTranslator } from '../../translator/get-translator';
import { sync as globby } from 'globby';

export const command = `translate <sourceGlobs...>`;

export const describe = '自动翻译 sourceGlob 中的文件，支持 html 和 markdown 两种格式';

export const builder: CommandBuilder = {
  sourceGlobs: {
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
      TranslationEngineType.noop,
    ],
    default: TranslationEngineType.gcloud,
  },
  dict: {
    type: 'string',
    description: '当使用 dict 引擎时，指定要使用的字典目录。字典目录与被翻译目标同构，每个字典文件为一个 markdown 文件',
  },
};

interface Params {
  sourceGlobs: string[];
  engine: TranslationEngineType;
  dict: string;
}

export const handler = async function ({ sourceGlobs, engine, dict }: Params) {
  const filenames = sourceGlobs.map(it => globby(it)).flat();
  for (const filename of filenames) {
    console.log('translating: ', filename);
    const translator = getTranslator(filename, getTranslationEngine(engine));
    await translator.translateFile(filename);
  }
};
