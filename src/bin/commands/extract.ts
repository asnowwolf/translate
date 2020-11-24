import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { concatAll, distinct, filter, groupBy, map, mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { writeFileSync } from 'fs';
import { TranslationEngineType } from '../../common';
import { from, GroupedObservable, Observable, of, zip } from 'rxjs';
import { DictEntryModel } from '../../models/dict-entry.model';
import { listFiles } from '../../rx-file';
import { Dict, DictEntry } from '../../dict';

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

export const handler = function ({ sourceGlob, outFile, unique, outType, pattern }: ExtractParams) {
  const engine = new TranslationKit(outType);
  const regExp = new RegExp(pattern, 'i');
  const files = listFiles(sourceGlob);
  engine.extractPairs(files, outType === TranslationEngineType.dict)
    .pipe(
      filter(it => regExp.test(it.english) || regExp.test(it.chinese)),
      unique ? distinct() : tap(),
      toArray(),
    )
    .subscribe((pairs) => {
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
          from(pairs).pipe(
            groupBy((it) => it.file),
            mergeMap((group: GroupedObservable<string, DictEntryModel>) => zip(of(group.key), group.pipe(toArray()))),
            switchMap(([file, pairs]) => saveToDict(outFile, file, pairs)),
          ).subscribe();
          break;
      }
    });
};

function saveToDict(dictFile: string, contextFile: string, pairs: DictEntryModel[]): Observable<DictEntry> {
  const dict = new Dict();
  return from(dict.open(dictFile)).pipe(
    switchMap(() => from(pairs).pipe(
      map((pair) => from(dict.createOrUpdate(contextFile, pair.english, pair.chinese))),
    )),
    concatAll(),
  );
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
