import { CommandBuilder } from 'yargs';
import { ensureHomeDir, TranslationEngineType } from '../../common';
import { getTranslationEngine } from '../../translation-engine/get-translation-engine';
import { getTranslator } from '../../translator/get-translator';
import { sync as globby } from 'globby';
import { Dict } from '../../dict/dict';
import { existsSync, readFileSync, writeFileSync } from 'fs';

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
  model: string;
  glossary: string;
  parent: string;
}

export const handler = async function (params: Params) {
  const filenames = params.sourceGlobs.map(it => globby(it)).flat();
  const dict = new Dict();
  await dict.open(params.dict);
  try {
    const translationEngine = getTranslationEngine(params.engine, {
      dict,
      model: params.model,
      glossary: params.glossary,
      parent: params.parent,
    });
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
    }
  } finally {
    await dict.close();
  }
};
