import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { writeFileSync } from 'fs';
import { TranslationEngineType } from '../../common';
import { DictEntryModel } from '../../models/dict-entry.model';
import { listFiles } from '../../file-utils';
import { Dict } from '../../dict';
import { forEach, groupBy, uniqBy } from 'lodash';

export const command = `extract <sourceGlob> [outFile]`;

export const describe = '提取翻译对';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  outFile: {
    description: '结果输出到的文件，不要带扩展名',
    default: 'STDOUT',
  },
  outType: {
    type: 'string',
    choices: [TranslationEngineType.google, TranslationEngineType.ms, TranslationEngineType.dict, TranslationEngineType.fake],
    default: TranslationEngineType.google,
  },
  pattern: {
    type: 'string',
    default: '.*',
    description: '要过滤的正则表达式',
  },
  unique: {
    type: 'boolean',
    default: false,
  },
};

interface ExtractParams {
  sourceGlob: string;
  outFile: string;
  unique: boolean;
  outType: TranslationEngineType;
  pattern: RegExp;
}

export const handler = async function ({ sourceGlob, outFile, unique, outType, pattern }: ExtractParams) {
  const engine = new TranslationKit(outType);
  const regExp = new RegExp(pattern, 'i');
  const files = listFiles(sourceGlob);
  const allPairs = await engine.extractPairsFromHtml(files, outType === TranslationEngineType.dict);
  const pairs = uniqBy(allPairs.filter(it => regExp.test(it.english) || regExp.test(it.chinese)), (it) => it.english + it.chinese);
  switch (outType) {
    case TranslationEngineType.google:
      const content = pairs.map(it => `${it.english}\t${it.chinese}`).join('\n');
      writeTo(outFile, 'pair', content);
      break;
    case TranslationEngineType.ms:
      writeTo(outFile, 'en', pairs.map(it => it.english).join('\n'));
      writeTo(outFile, 'cn', pairs.map(it => it.chinese).join('\n'));
      break;
    case TranslationEngineType.dict:
      const grouped = groupBy(pairs, it => it.file);
      forEach(grouped, async (pairs, file) => {
        await saveToDict(outFile, file, pairs);
      });
      break;
  }
};

async function saveToDict(dictFile: string, contextFile: string, pairs: DictEntryModel[]): Promise<void> {
  const dict = new Dict();
  await dict.open(dictFile);
  await Promise.all(pairs.map(async pair => await dict.createOrUpdate(contextFile, pair.english, pair.chinese)));
}

function writeTo(filename: string, lang: 'pair' | 'en' | 'cn' | 'dict', content: string): void {
  if (filename === 'STDOUT') {
    process.stdout.write(content);
  } else if (lang === 'dict') {
    writeFileSync(filename, content);
  } else {
    writeFileSync(`${filename}_${lang}.txt`, content);
  }
}
