import { CommandBuilder } from 'yargs';
import { Dict } from '../../dict/dict';
import { basenameWithoutExt, TranslationEngineType } from '../../common';
import { Exporter } from '../../exporter/exporter';
import { writeFileSync } from 'fs';

export const command = `export <dictFile>`;

export const describe = '导出 AutoML 训练集';

export const builder: CommandBuilder = {
  dictFile: {
    description: '要使用的词典，不用带扩展名',
  },
  engine: {
    type: 'string',
    description: '要导出到的翻译引擎',
    choices: [
      TranslationEngineType.gcloud,
      TranslationEngineType.ms,
    ],
    default: TranslationEngineType.gcloud,
  },
};

interface ExportsParams {
  dictFile: string;
  engine: TranslationEngineType;
}

export const handler = async function ({ dictFile, engine }: ExportsParams) {
  const dict = new Dict();
  await dict.open(dictFile);
  try {
    const entries = await dict.findAll({ where: { isRegExp: false } });
    const exporter = new Exporter();
    const result = exporter.export(entries);
    if (engine === TranslationEngineType.ms) {
      const english = result.map(it => it.english).join('\n');
      const basename = basenameWithoutExt(dictFile);
      writeFileSync(`${basename}_en-US.align`, english, 'utf8');
      const chinese = result.map(it => it.chinese).join('\n');
      writeFileSync(`${basename}_zh-Hans.align`, chinese, 'utf8');
    }
  } finally {
    await dict.close();
  }
};
