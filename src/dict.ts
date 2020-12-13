import { Column, Connection, ConnectionOptions, createConnection, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { basename } from 'path';

@Entity()
export class DictEntry {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  path: string;
  @Column()
  filename: string;
  @Column()
  xpath: string;
  @Column({ type: 'nvarchar', length: 256 })
  english: string;
  @Column({ type: 'nvarchar', length: 256 })
  chinese: string;
}

export class Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntry>;

  async open(filename: string) {
    const options: ConnectionOptions = {
      type: 'sqlite',
      database: filename,
      entities: [DictEntry],
      synchronize: true,
    };
    this.connection = await createConnection(options);
    this.dictRepo = this.connection.getRepository(DictEntry);
  }

  async close() {
    return this.connection.close();
  }

  async find(filePath: string, english: string): Promise<DictEntry> {
    const matches = await this.dictRepo.find({ english });
    return matches.find(it => it.path === filePath) ??
      matches.find(it => basename(it.path) === basename(filePath)) ??
      matches[0];
  }

  async createOrUpdate(filePath: string, english: string, chinese: string, xpath: string): Promise<DictEntry> {
    const entry = await this.dictRepo.findOne({ path: filePath, english });
    if (entry) {
      entry.chinese = chinese;
      entry.xpath = xpath;
      return await this.dictRepo.save(entry);
    } else {
      return await this.dictRepo.save({ path: filePath, xpath, english, chinese, filename: basename(filePath) });
    }
  }
}
