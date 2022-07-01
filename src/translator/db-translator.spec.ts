import { SqliteDict } from '../dict/sqlite-dict';
import { DbTranslator } from './db-translator';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { pick } from 'lodash';

describe('db-translator', () => {
  it('translate it', async () => {
    const dict = new SqliteDict();
    await dict.open(':memory:');
    try {
      await dict.createOrUpdate('one', '', 'plain');
      const translator = new DbTranslator(new FakeTranslationEngine());
      await translator.translateDict(dict);
      const entries = await dict.query();
      expect(pick(entries[0], 'english', 'chinese', 'confidence')).toEqual({
        'chinese': '译one',
        'confidence': 'Engine',
        'english': 'one',
      });
    } finally {
      await dict.close();
    }
  });
});
