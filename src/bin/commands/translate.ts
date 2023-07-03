import { CommandBuilder } from 'yargs';
import { getTranslationEngine } from '../../translation-engine/get-translation-engine';
import { getTranslator } from '../../translator/get-translator';
import { sync as globby } from 'globby';
import { TranslationEngineType } from '../../translation-engine/translation-engine-type';

export const command = `translate <sourceGlobs...>`;

export const describe = '自动翻译 sourceGlob 中的文件，支持 html 和 markdown 两种格式';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  engine: {
    type: 'string',
    description: '要使用的翻译引擎。如果使用 normalize 引擎可以对目标进行预处理，以减少变更冲突',
    choices: [
      TranslationEngineType.google,
      TranslationEngineType.dict,
      TranslationEngineType.fake,
      TranslationEngineType.normalizer,
      TranslationEngineType.extractor,
      TranslationEngineType.vectorizer,
    ],
    default: TranslationEngineType.google,
  },
  dict: {
    type: 'string',
    description: '当使用 dict 引擎时，指定要使用的字典目录，字典目录是由一组 markdown 文件构成的与原文同构的目录。',
  },
  jsonProperties: {
    type: 'array',
    alias: 'jp',
    description: '当进行 json 翻译时，要翻译的属性名称，会自动进行递归查找。',
    default: [],
  },
  mustIncludesTag: {
    type: 'string',
    alias: 'it',
    description: '当进行 jsdoc 翻译时，只有具有此标签的注释及其子注释才会被翻译，比如 Angular 官方文档中，这个值是 `publicApi`',
  },
  mustExcludesTag: {
    type: 'string',
    alias: 'et',
    description: '当进行 jsdoc 翻译时，只有没有此标签的注释及其子注释才会被翻译，比如 Angular Components 官方文档中，这个值是 `docs-private`',
  },
};

interface Params {
  sourceGlobs: string[];
  engine: TranslationEngineType;
  dict: string;
  // 源文件的基础路径，用于从文件名计算出相对路径，以便在词典中保留相对路径
  cwd: string;
  mustIncludesTag: string;
  mustExcludesTag: string;
  jsonProperties: string[];
}

export const handler = async function (params: Params) {
  const filenames = globby(params.sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }

  const translationEngine = getTranslationEngine(params.engine, params);
  for (const filename of filenames) {
    console.log('translating: ', filename);
    const translator = getTranslator(filename, translationEngine, params);
    await translator.setup();
    try {
      await translator.translateFile(filename, params);
    } finally {
      await translator.tearDown();
    }
  }
};
