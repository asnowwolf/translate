import { MarkdownTranslator } from '../translator/markdown-translator';
import { ExtractorEngine } from '../translation-engine/extractor-engine';
import { DictEntry } from './dict-entry';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

export class Dict {
  entries: DictEntry[] = [];

  constructor() {
  }

  async open(dictFile: string): Promise<void> {
    const engine = new ExtractorEngine();
    await engine.setup('');
    try {
      const translator = new MarkdownTranslator(engine);
      if (!existsSync(dictFile)) {
        mkdirSync(dirname(dictFile), { recursive: true });
        writeFileSync(dictFile, '', 'utf8');
      }
      await translator.translateFile(dictFile);
      this.entries = engine.entries;
    } finally {
      await engine.tearDown();
    }
  }

  async close(): Promise<void> {
  }

  async get(english: string): Promise<DictEntry> {
    return fuzzyLookup(this.entries, english);
  }
}


const markdownHeaderPattern = /^(#+) +(.*)$/;

function fuzzyLookup(entries: DictEntry[], english: string): DictEntry | undefined {
  for (let entry of entries) {
    const [, , base1] = entry.english.match(markdownHeaderPattern) ?? ['', '', entry.english];
    const [, prefix, base2] = english.match(markdownHeaderPattern) ?? ['', '', english];
    if (base1 === base2) {
      const [, , chinese] = entry.chinese?.match(markdownHeaderPattern) ?? ['', '', entry.chinese];
      return { ...entry, chinese: [prefix, chinese].filter(it => !!it).join(' ') };
    }
  }
}
