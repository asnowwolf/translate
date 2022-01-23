import { CommandBuilder } from 'yargs';
import { ensureHomeDir, TranslationEngineType } from '../../common';
import { getTranslationEngine } from '../../translation-engine/get-translation-engine';
import { getTranslator } from '../../translator/get-translator';
import { sync as globby } from 'globby';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export const command = `translate <sourceGlobs...>`;

export const describe = '自动翻译 sourceGlob 中的文件，支持 html 和 markdown 两种格式';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  engine: {
    type: 'string',
    description: '要使用的翻译引擎。使用 noop 引擎相当于对 HTML 进行预处理，以减少变更',
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
    description: '当使用 dict 引擎时，指定要使用的字典文件，目前只支持 sqlite 格式。',
  },
  parent: {
    type: 'string',
    description: 'GCE 中的父项目，默认为本作者的项目',
    default: 'projects/ralph-gde/locations/us-central1',
  },
  model: {
    type: 'string',
    description: '要使用的自定义 AutoML 模型，默认为 Angular 的。none 表示不用任何模型',
    default: 'TRL9199068616738092360',
  },
  glossary: {
    type: 'string',
    description: '要使用的词汇表，默认为编程词汇集。none 表示不用任何词汇表',
    choices: [
      'programming',
      'angular',
      'material',
    ],
    default: 'programming',
  },
  jsonProperties: {
    type: 'array',
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
  mustIncludesTag: string;
  mustExcludesTag: string;
  jsonProperties: string[];
  model: string;
  glossary: string;
  parent: string;
}

export const handler = async function (params: Params) {
  const filenames = params.sourceGlobs.map(it => globby(it)).flat();
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  const translationEngine = getTranslationEngine(params.engine, {
    dict: params.dict,
    model: params.model,
    glossary: params.glossary,
    parent: params.parent,
  });
  await translationEngine.init();
  try {
    for (const filename of filenames) {
      console.log('translating: ', filename);
      const translator = getTranslator(filename, translationEngine, params);
      await translator.translateFile(filename);
    }
  } finally {
    // 记录已经执行的数量，统一记录在应用目录下
    const counterFilename = `${ensureHomeDir()}/${params.engine}_count.txt`;
    const count = existsSync(counterFilename) ? +readFileSync(counterFilename, 'utf8').trim() : 0;
    writeFileSync(counterFilename, (count + translationEngine.translated).toString(10), 'utf8');
    await translationEngine.dispose();
  }
};
