import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { filter, toArray } from 'rxjs/operators';
import { writeFileSync } from 'fs';
import { TranslationEngineType } from '../../common';

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
    choices: [TranslationEngineType.google, TranslationEngineType.ms],
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

export const handler = function ({ sourceGlob, outFile, unique, outType, pattern }: ExtractParams) {
  const engine = new TranslationKit(outType);
  const regExp = new RegExp(pattern, 'i');
  return engine.extractTrainingDataset(sourceGlob, unique)
    .pipe(
      filter(it => regExp.test(it.english) || regExp.test(it.chinese)),
      toArray(),
    )
    .subscribe((pairs) => {
      if (outType === TranslationEngineType.google) {
        const content = pairs.map(it => `${it.english}\t${it.chinese}`).join('\n');
        writeTo(outFile, 'pair', content);
      } else if (outType === TranslationEngineType.ms) {
        writeTo(outFile, 'en', pairs.map(it => it.english).join('\n'));
        writeTo(outFile, 'cn', pairs.map(it => it.chinese).join('\n'));
      }
    });
};

function writeTo(filename: string, lang: 'pair' | 'en' | 'cn', content: string): void {
  if (filename === 'STDOUT') {
    process.stdout.write(content);
  } else {
    writeFileSync(`${filename}_${lang}.txt`, content);
  }
}
