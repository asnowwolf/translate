import { Dict } from './dict';
import { SqliteDict } from './sqlite-dict';

export enum DictType {
  Folder,
  Sqlite,
}

export function getDict(type: DictType = DictType.Sqlite): Dict {
  switch (type) {
    case DictType.Folder:
      throw new Error('Not implemented');
    case DictType.Sqlite:
      return new SqliteDict();
  }
}
